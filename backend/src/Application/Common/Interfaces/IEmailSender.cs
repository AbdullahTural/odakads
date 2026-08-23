namespace HasanHabibSeyda.Application.Common.Interfaces;

public interface IEmailSender
{
    /// <summary>HTML e-posta gonderir. Yapilandirma yoksa loglar ve sessizce gecer.</summary>
    Task SendAsync(string subject, string htmlBody, string? replyTo = null, CancellationToken cancellationToken = default);
}
