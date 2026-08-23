namespace HasanHabibSeyda.API.Middleware;

/// <summary>API ve statik frontend icin uygun guvenlik HTTP basliklari.</summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;
        var path = context.Request.Path.Value ?? "";
        var isApi = path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase);

        headers["X-Content-Type-Options"] = "nosniff";
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

        if (isApi)
        {
            headers["X-Frame-Options"] = "DENY";
            headers["Content-Security-Policy"] =
                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'";
        }
        else
        {
            headers["X-Frame-Options"] = "SAMEORIGIN";
            // Next.js static export + analytics scriptleri (GA4, GTM, Clarity, Meta, LinkedIn)
            headers["Content-Security-Policy"] =
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net https://snap.licdn.com; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https: blob: https://i.ytimg.com; " +
                "font-src 'self' data:; " +
                "connect-src 'self' https:; " +
                "frame-src https://www.googletagmanager.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com; " +
                "child-src https://www.googletagmanager.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com; " +
                "frame-ancestors 'self'; " +
                "base-uri 'self'; " +
                "form-action 'self'";
        }

        await _next(context);
    }
}
