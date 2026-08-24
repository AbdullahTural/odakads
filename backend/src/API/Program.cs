using System.IO.Compression;
using System.Text;
using System.Threading.RateLimiting;
using HasanHabibSeyda.API.Middleware;
using HasanHabibSeyda.API.Services;
using HasanHabibSeyda.Application;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Features.Blogs.Queries;
using MediatR;
using Microsoft.Extensions.FileProviders;
using HasanHabibSeyda.Infrastructure;
using HasanHabibSeyda.Infrastructure.Settings;
using HasanHabibSeyda.Persistence;
using HasanHabibSeyda.Persistence.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog ---
builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));

// --- Katman servisleri ---
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPersistence(builder.Configuration);

// --- Aktif kullanici (log'lar + interceptor icin) ---
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<LogoUploadService>();
builder.Services.AddScoped<MediaUploadService>();

// --- Controllers (System.Text.Json varsayilan camelCase) ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddResponseCaching();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
    options.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
    options.Level = CompressionLevel.Fastest);

// --- Rate limiting (contact + login, IP basina) ---
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync(
            "{\"success\":false,\"message\":\"Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.\",\"data\":null}",
            token);
    };

    static string Ip(HttpContext c) => c.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    options.AddPolicy("contact", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(Ip(httpContext), _ =>
            new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1) }));

    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(Ip(httpContext), _ =>
            new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1) }));
});

// --- CORS (tek-host production'da cross-origin gerekmez; dev icin localhost) ---
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? Array.Empty<string>();
if (corsOrigins.Length > 0)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
            policy.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod());
    });
}

// --- Cloudflare / reverse proxy (Production) ---
if (!builder.Environment.IsDevelopment())
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedFor
            | ForwardedHeaders.XForwardedProto
            | ForwardedHeaders.XForwardedHost;
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });
}

// --- JWT Authentication ---
var jwt = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt.Issuer,
        ValidAudience = jwt.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
        ClockSkew = TimeSpan.FromMinutes(1),
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILoggerFactory>()
                .CreateLogger("Auth.Jwt");
            logger.LogWarning(
                "JWT dogrulama basarisiz: {Path}, IP: {Ip}, Hata: {Error}",
                context.Request.Path,
                context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                context.Exception.Message);
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILoggerFactory>()
                .CreateLogger("Auth.Jwt");
            logger.LogWarning(
                "Yetkisiz erisim: {Path}, IP: {Ip}, Hata: {Error}",
                context.Request.Path,
                context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                context.ErrorDescription ?? context.Error ?? "Unauthorized");
            return Task.CompletedTask;
        },
    };
});
builder.Services.AddAuthorization();

// --- Swagger (Development only) ---
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Odak Ads Reklam API",
            Version = "v1",
            Description = "Odak Ads Reklam — Public + Admin Web API",
        });

        var scheme = new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT access token'i 'Bearer {token}' olarak girin (login uçundan alın).",
            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
        };
        options.AddSecurityDefinition("Bearer", scheme);
        options.AddSecurityRequirement(new OpenApiSecurityRequirement { [scheme] = Array.Empty<string>() });
    });
}

var app = builder.Build();

// --- Migration + Seed (Database:AutoMigrate / Database:SeedOnStartup) ---
var dbSettings = builder.Configuration.GetSection(DatabaseSettings.SectionName).Get<DatabaseSettings>()
    ?? new DatabaseSettings();

if (dbSettings.AutoMigrate || dbSettings.SeedOnStartup)
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup.Database");

    if (dbSettings.AutoMigrate)
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        logger.LogInformation("Veritabani migration uygulaniyor...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Migration tamamlandi.");
    }

    if (dbSettings.SeedOnStartup)
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        logger.LogInformation("Seed verisi kontrol ediliyor (bos tablolar doldurulur)...");
        await DbSeeder.SeedAsync(db, hasher);
        logger.LogInformation("Seed tamamlandi.");
    }
}
else
{
    app.Logger.LogInformation(
        "Database:AutoMigrate ve Database:SeedOnStartup kapali — migration/seed atlandi.");
}

// wwwroot varligi — bos wwwroot'ta tum sayfalar 404 verir
var wwwroot = app.Environment.WebRootPath;
var rootIndex = Path.Combine(wwwroot, "index.html");
if (!File.Exists(rootIndex))
{
    app.Logger.LogWarning(
        "wwwroot bos veya index.html yok: {WebRoot}. Static export kopyalandi mi? (npm run copy:wwwroot)",
        wwwroot);
}
else
{
    var pageCount = Directory.Exists(wwwroot)
        ? Directory.EnumerateFiles(wwwroot, "index.html", SearchOption.AllDirectories).Count()
        : 0;
    app.Logger.LogInformation(
        "Static site wwwroot hazir: {WebRoot} ({PageCount} index.html)",
        wwwroot,
        pageCount);
}

// --- Pipeline ---
if (!app.Environment.IsDevelopment())
{
    app.UseForwardedHeaders();
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseResponseCompression();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Odak Ads Reklam API v1"));
}

if (corsOrigins.Length > 0)
    app.UseCors("Frontend");
app.UseResponseCaching();
app.UseRateLimiter();

// --- Next.js static export (wwwroot) ---
// 1) HTML sayfalari dogrudan servis et (/, /hakkimizda/, /admin/login/ ...)
// 2) _next, css, js, robots.txt vb. icin UseStaticFiles
app.UseMiddleware<StaticSiteHtmlMiddleware>();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.Context.Request.Path.Value ?? "";
        if (path.Contains("/_next/static/", StringComparison.Ordinal)
            || path.StartsWith("/images/", StringComparison.Ordinal))
        {
            ctx.Context.Response.Headers.CacheControl = "public,max-age=31536000,immutable";
        }
    },
});

// --- Yuklenen medya (blog kapaklari vb.) — wwwroot DISINDA, kalici → /media/* ---
// Static export wwwroot'a kopyalanirken (build:deploy) silinmez.
var mediaRoot = MediaUploadService.ResolveMediaRoot(app.Environment, app.Configuration);
Directory.CreateDirectory(mediaRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(mediaRoot),
    RequestPath = "/media",
    OnPrepareResponse = ctx =>
        ctx.Context.Response.Headers.CacheControl = "public,max-age=2592000",
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Yedek: middleware + static files kacirdiysa HTML coz veya 404.html
app.MapFallback(async (HttpContext context, IWebHostEnvironment env) =>
{
    var path = context.Request.Path.Value ?? "";
    if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "application/json; charset=utf-8";
        await context.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = "Endpoint bulunamadı.",
            data = (object?)null,
        });
        return;
    }

    if (HttpMethods.IsGet(context.Request.Method) || HttpMethods.IsHead(context.Request.Method))
    {
        if (StaticSitePathResolver.TryResolveIndexHtml(env, path, out var physicalPath))
        {
            context.Response.StatusCode = StatusCodes.Status200OK;
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync(physicalPath);
            return;
        }

        // Yayindayken slug'i degistirilmis bir blog yazisi icin 301 (PreviousSlugs → guncel slug).
        // Best-effort: cozulemezse normal 404 akisina duser.
        if (path.StartsWith("/blog/", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                var segments = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
                if (segments.Length == 2)
                {
                    var sender = context.RequestServices.GetRequiredService<ISender>();
                    var currentSlug = await sender.Send(new ResolveBlogRedirectQuery(segments[1]));
                    if (!string.IsNullOrEmpty(currentSlug))
                    {
                        context.Response.Redirect($"/blog/{currentSlug}/", permanent: true);
                        return;
                    }
                }
            }
            catch
            {
                // yonlendirme cozulemedi — 404'e devam
            }
        }
    }

    var notFoundPage = Path.Combine(env.WebRootPath, "404.html");
    if (File.Exists(notFoundPage))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(notFoundPage);
        return;
    }

    context.Response.StatusCode = StatusCodes.Status404NotFound;
}).AllowAnonymous();

app.Run();
