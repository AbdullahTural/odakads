namespace HasanHabibSeyda.API.Services;

/// <summary>
/// Blog kapak gorsellerini <b>wwwroot disinda</b> kalici bir klasore kaydeder ve <c>/media/*</c> ile servis edilir.
/// Boylece Next.js static export'un wwwroot'a kopyalanmasi (build:deploy) yuklenen gorselleri silmez.
///
/// Konum: <c>Media:RootPath</c> (appsettings) — mutlak yol onerilir (deploy klasoru disinda, kalici).
/// Varsayilan: <c>ContentRootPath/App_Data/uploads</c>.
/// Guvenlik: uzanti + <b>icerik imzasi (magic bytes)</b> dogrulamasi, boyut siniri, GUID dosya adi.
/// </summary>
public class MediaUploadService
{
    private const long MaxBytes = 5 * 1024 * 1024; // 5 MB

    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public MediaUploadService(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    /// <summary>Yapilandirilmis (veya varsayilan) medya kok klasoru.</summary>
    public string MediaRoot => ResolveMediaRoot(_env, _config);

    public static string ResolveMediaRoot(IWebHostEnvironment env, IConfiguration config)
    {
        var configured = config["Media:RootPath"];
        if (!string.IsNullOrWhiteSpace(configured))
            return Path.IsPathRooted(configured)
                ? configured
                : Path.Combine(env.ContentRootPath, configured);

        return Path.Combine(env.ContentRootPath, "App_Data", "uploads");
    }

    /// <summary>Gorseli kaydeder ve public URL (<c>/media/{subFolder}/{ad}</c>) doner.</summary>
    public async Task<MediaUploadResultDto> SaveImageAsync(IFormFile file, string subFolder, CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            throw new InvalidOperationException("Dosya seçilmedi.");

        if (file.Length > MaxBytes)
            throw new InvalidOperationException("Dosya boyutu 5 MB sınırını aşıyor.");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);
        var bytes = ms.ToArray();

        var ext = DetectImageExtension(bytes)
            ?? throw new InvalidOperationException("Yalnızca PNG, JPG, WEBP veya GIF görseli yüklenebilir.");

        var safeSub = SanitizeSubFolder(subFolder);
        var targetDir = Path.Combine(MediaRoot, safeSub);
        Directory.CreateDirectory(targetDir);

        var safeName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(targetDir, safeName);
        await File.WriteAllBytesAsync(fullPath, bytes, ct);

        return new MediaUploadResultDto($"/media/{safeSub}/{safeName}");
    }

    private static string SanitizeSubFolder(string subFolder)
    {
        var cleaned = new string((subFolder ?? "").Where(c => char.IsLetterOrDigit(c) || c is '-' or '_').ToArray());
        return string.IsNullOrEmpty(cleaned) ? "misc" : cleaned.ToLowerInvariant();
    }

    /// <summary>Dosya icerigine (magic bytes) gore gercek gorsel turunu tespit eder; desteklenmiyorsa null.</summary>
    private static string? DetectImageExtension(byte[] b)
    {
        if (b.Length >= 3 && b[0] == 0xFF && b[1] == 0xD8 && b[2] == 0xFF)
            return ".jpg";
        if (b.Length >= 8 && b[0] == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47
            && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A)
            return ".png";
        if (b.Length >= 4 && b[0] == 0x47 && b[1] == 0x49 && b[2] == 0x46 && b[3] == 0x38)
            return ".gif";
        if (b.Length >= 12
            && b[0] == (byte)'R' && b[1] == (byte)'I' && b[2] == (byte)'F' && b[3] == (byte)'F'
            && b[8] == (byte)'W' && b[9] == (byte)'E' && b[10] == (byte)'B' && b[11] == (byte)'P')
            return ".webp";
        return null;
    }
}

public record MediaUploadResultDto(string Url);
