namespace HasanHabibSeyda.API.Middleware;

/// <summary>
/// Next.js static export (trailingSlash: true) — uzantisiz URL → wwwroot/.../index.html
/// </summary>
public static class StaticSitePathResolver
{
    public static bool IsStaticAssetPath(string path) =>
        path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
        || path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase)
        || path.StartsWith("/_next", StringComparison.OrdinalIgnoreCase);

    public static bool TryResolveIndexHtml(
        IWebHostEnvironment env,
        string path,
        out string physicalPath)
    {
        physicalPath = "";

        if (IsStaticAssetPath(path))
            return false;

        if (string.IsNullOrEmpty(path) || path == "/")
        {
            var rootIndex = Path.Combine(env.WebRootPath, "index.html");
            if (File.Exists(rootIndex))
            {
                physicalPath = rootIndex;
                return true;
            }
            return false;
        }

        if (Path.HasExtension(path.TrimEnd('/')))
            return false;

        var trimmed = path.TrimEnd('/');
        var relative = trimmed.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var indexPath = Path.Combine(env.WebRootPath, relative, "index.html");

        if (!File.Exists(indexPath))
            return false;

        physicalPath = indexPath;
        return true;
    }

    public static string ToPhysicalPath(IWebHostEnvironment env, string requestPath) =>
        Path.Combine(
            env.WebRootPath,
            requestPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
}
