using HasanHabibSeyda.Application.DTOs;

namespace HasanHabibSeyda.API.Services;

/// <summary>Referans firma logolarini wwwroot/images/logos/ altina guvenli sekilde kaydeder.</summary>
public class LogoUploadService
{
    private const long MaxBytes = 2 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".png", ".jpg", ".jpeg", ".webp", ".svg",
    };

    private static readonly Dictionary<string, string> MimeToExt = new(StringComparer.OrdinalIgnoreCase)
    {
        ["image/png"] = ".png",
        ["image/jpeg"] = ".jpg",
        ["image/webp"] = ".webp",
        ["image/svg+xml"] = ".svg",
    };

    private readonly IWebHostEnvironment _env;

    public LogoUploadService(IWebHostEnvironment env) => _env = env;

    public async Task<LogoUploadResultDto> SaveLogoAsync(IFormFile file, CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            throw new InvalidOperationException("Dosya seçilmedi.");

        if (file.Length > MaxBytes)
            throw new InvalidOperationException("Dosya boyutu 2 MB sınırını aşıyor.");

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(ext) && MimeToExt.TryGetValue(file.ContentType ?? "", out var fromMime))
            ext = fromMime;

        if (!AllowedExtensions.Contains(ext))
            throw new InvalidOperationException("Yalnızca PNG, JPG, WEBP veya SVG yüklenebilir.");

        var logosDir = Path.Combine(_env.WebRootPath, "images", "logos");
        Directory.CreateDirectory(logosDir);

        var safeName = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var fullPath = Path.Combine(logosDir, safeName);

        await using var stream = new FileStream(fullPath, FileMode.CreateNew);
        await file.CopyToAsync(stream, ct);

        return new LogoUploadResultDto($"/images/logos/{safeName}");
    }
}

public record LogoUploadResultDto(string Url);
