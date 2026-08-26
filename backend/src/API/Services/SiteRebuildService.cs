using System.Diagnostics;
using System.Text;

namespace HasanHabibSeyda.API.Services;

/// <summary>
/// "Siteyi Yayına Al" — statik siteyi (blog + SEO) yeniden üretir.
/// Admin panelden tetiklenir; yapilandirilmis komutu (varsayilan: npm run build:deploy)
/// sunucuda arka planda calistirir. GUVENLIK: komut appsettings'ten gelir (kullanici girdisi DEGIL);
/// varsayilan KAPALI (Rebuild:Enabled=true olana kadar calismaz).
///
/// Singleton olarak kaydedilir; ayni anda tek yayinlama calisir.
/// </summary>
public class SiteRebuildService
{
    private readonly object _lock = new();
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<SiteRebuildService> _logger;

    public SiteRebuildService(IConfiguration config, IWebHostEnvironment env, ILogger<SiteRebuildService> logger)
    {
        _config = config;
        _env = env;
        _logger = logger;
    }

    public RebuildState State { get; private set; } = new();

    public bool Enabled =>
        bool.TryParse(_config["Rebuild:Enabled"], out var e) && e;

    /// <summary>Yayinlamayi baslatir. Zaten calisiyorsa veya kapaliysa false doner.</summary>
    public (bool Started, string Message) TryStart()
    {
        if (!Enabled)
            return (false, "Yeniden yayınlama sunucuda henüz yapılandırılmadı. (Rebuild:Enabled)");

        lock (_lock)
        {
            if (State.Status == "running")
                return (false, "Zaten bir yayınlama işlemi sürüyor. Lütfen bekleyin.");

            State = new RebuildState
            {
                Status = "running",
                StartedAt = DateTime.UtcNow,
                FinishedAt = null,
                Message = "Yayınlanıyor... (bu işlem 1-2 dakika sürebilir)",
            };
        }

        _ = Task.Run(RunAsync);
        return (true, "Yayınlama başlatıldı.");
    }

    private async Task RunAsync()
    {
        var fileName = _config["Rebuild:FileName"];
        if (string.IsNullOrWhiteSpace(fileName)) fileName = "npm";
        var arguments = _config["Rebuild:Arguments"];
        if (string.IsNullOrWhiteSpace(arguments)) arguments = "run build:deploy";
        var workingDir = _config["Rebuild:WorkingDirectory"];
        if (string.IsNullOrWhiteSpace(workingDir)) workingDir = _env.ContentRootPath;
        var timeoutSeconds = int.TryParse(_config["Rebuild:TimeoutSeconds"], out var t) ? t : 900;

        var started = State.StartedAt ?? DateTime.UtcNow;

        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                WorkingDirectory = workingDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using var proc = new Process { StartInfo = psi };
            var tail = new StringBuilder();
            void Capture(string? line)
            {
                if (line is null) return;
                lock (tail)
                {
                    tail.AppendLine(line);
                    if (tail.Length > 4000) tail.Remove(0, tail.Length - 4000);
                }
            }
            proc.OutputDataReceived += (_, e) => Capture(e.Data);
            proc.ErrorDataReceived += (_, e) => Capture(e.Data);

            proc.Start();
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(timeoutSeconds));
            await proc.WaitForExitAsync(cts.Token);

            var ok = proc.ExitCode == 0;
            SetResult(
                ok ? "success" : "failed",
                started,
                ok ? "Site başarıyla yayınlandı. Değişiklikler birkaç dakika içinde görünür." : $"Yayınlama başarısız oldu (çıkış kodu {proc.ExitCode}).");

            _logger.Log(ok ? LogLevel.Information : LogLevel.Error,
                "Site rebuild bitti: {Status} (kod {Code})", ok ? "success" : "failed", proc.ExitCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Site rebuild hatası: {Message}", ex.Message);
            SetResult("failed", started, "Yayınlama sırasında sunucu hatası oluştu.");
        }
    }

    private void SetResult(string status, DateTime started, string message)
    {
        lock (_lock)
        {
            State = new RebuildState
            {
                Status = status,
                StartedAt = started,
                FinishedAt = DateTime.UtcNow,
                Message = message,
            };
        }
    }
}

/// <summary>Yayinlama durumu (frontend RebuildState ile birebir).</summary>
public class RebuildState
{
    /// <summary>idle | running | success | failed</summary>
    public string Status { get; set; } = "idle";
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
