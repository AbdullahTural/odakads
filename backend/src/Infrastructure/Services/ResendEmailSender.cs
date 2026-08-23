using System.Net.Http.Headers;
using System.Net.Http.Json;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Infrastructure.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HasanHabibSeyda.Infrastructure.Services;

/// <summary>
/// Resend (https://resend.com) ile e-posta gonderir.
/// ApiKey/To bos ise loglar ve sessizce gecer (lokal gelistirme).
/// </summary>
public class ResendEmailSender : IEmailSender
{
    private readonly HttpClient _http;
    private readonly ResendSettings _settings;
    private readonly ILogger<ResendEmailSender> _logger;

    public ResendEmailSender(
        HttpClient http,
        IOptions<ResendSettings> settings,
        ILogger<ResendEmailSender> logger)
    {
        _http = http;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string subject, string htmlBody, string? replyTo = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey) || string.IsNullOrWhiteSpace(_settings.To))
        {
            _logger.LogInformation(
                "E-posta yapilandirmasi yok — gonderim simule edildi. Konu: {Subject}", subject);
            return;
        }

        try
        {
            var payload = new Dictionary<string, object?>
            {
                ["from"] = _settings.From,
                ["to"] = new[] { _settings.To },
                ["subject"] = subject,
                ["html"] = htmlBody,
            };
            if (!string.IsNullOrWhiteSpace(replyTo))
                payload["reply_to"] = replyTo;

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);
            request.Content = JsonContent.Create(payload);

            var response = await _http.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Resend gonderim hatasi ({Status}): {Body}", (int)response.StatusCode, body);
            }
        }
        catch (Exception ex)
        {
            // E-posta hatasi ana akisi bozmamali — kayit zaten DB'de.
            _logger.LogError(ex, "E-posta gonderiminde beklenmeyen hata.");
        }
    }
}
