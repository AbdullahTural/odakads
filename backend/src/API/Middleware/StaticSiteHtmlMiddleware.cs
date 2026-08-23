namespace HasanHabibSeyda.API.Middleware;

/// <summary>
/// Next.js static export sayfalarini dogrudan wwwroot'tan servis eder.
/// Path rewrite + UseStaticFiles zincirine guvenmez; GET/HEAD HTML isteklerini kisa devre ile cozer.
/// Ornek: /, /hakkimizda/, /hakkimizda, /admin/login/ → ilgili .../index.html
/// </summary>
public class StaticSiteHtmlMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<StaticSiteHtmlMiddleware> _logger;

    public StaticSiteHtmlMiddleware(
        RequestDelegate next,
        IWebHostEnvironment env,
        ILogger<StaticSiteHtmlMiddleware> logger)
    {
        _next = next;
        _env = env;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (HttpMethods.IsGet(context.Request.Method) || HttpMethods.IsHead(context.Request.Method))
        {
            var path = context.Request.Path.Value ?? "";

            if (StaticSitePathResolver.TryResolveIndexHtml(_env, path, out var physicalPath))
            {
                _logger.LogDebug("Static HTML: {Path} → {File}", path, physicalPath);
                context.Response.StatusCode = StatusCodes.Status200OK;
                context.Response.ContentType = "text/html; charset=utf-8";
                await context.Response.SendFileAsync(physicalPath);
                return;
            }
        }

        await _next(context);
    }
}
