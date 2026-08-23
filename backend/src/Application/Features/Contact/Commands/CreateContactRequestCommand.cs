using System.Net;
using System.Text.RegularExpressions;
using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HasanHabibSeyda.Application.Features.Contact.Commands;

/// <summary>
/// Public iletisim formu. Frontend ContactRequestDto (fullName, phone, email, company,
/// serviceType, message, website[honeypot]) ile birebir baglanir.
/// </summary>
public record CreateContactRequestCommand : IRequest<ContactResponseDto>
{
    public string FullName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string ServiceType { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    /// <summary>Honeypot — dolu gelirse spam kabul edilir.</summary>
    public string? Website { get; init; }
    /// <summary>Form yuklenme zamani (ISO). Cok hizli gonderim spam kontrolu icin.</summary>
    public string? FormLoadedAt { get; init; }
}

public class CreateContactRequestCommandValidator : AbstractValidator<CreateContactRequestCommand>
{
    public CreateContactRequestCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Ad Soyad zorunludur.")
            .MinimumLength(2).WithMessage("Ad Soyad en az 2 karakter olmalıdır.")
            .MaximumLength(120).WithMessage("Ad Soyad çok uzun.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefon zorunludur.")
            .Matches(@"^(\+?\d[\d\s()-]{8,17}\d)$").WithMessage("Geçerli bir telefon numarası girin.")
            .MaximumLength(40).WithMessage("Telefon numarası çok uzun.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta zorunludur.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi girin.")
            .MaximumLength(200).WithMessage("E-posta adresi çok uzun.");

        RuleFor(x => x.Company)
            .NotEmpty().WithMessage("Firma adı zorunludur.")
            .MinimumLength(2).WithMessage("Firma adı en az 2 karakter olmalıdır.")
            .MaximumLength(160).WithMessage("Firma adı çok uzun.");

        RuleFor(x => x.ServiceType)
            .NotEmpty().WithMessage("Lütfen bir hizmet türü seçin.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Mesaj zorunludur.")
            .MinimumLength(10).WithMessage("Mesajınız en az 10 karakter olmalıdır.")
            .MaximumLength(4000).WithMessage("Mesajınız çok uzun.");
    }
}

public class CreateContactRequestCommandHandler
    : IRequestHandler<CreateContactRequestCommand, ContactResponseDto>
{
    private readonly IAppDbContext _db;
    private readonly IEmailSender _email;
    private readonly ILogger<CreateContactRequestCommandHandler> _logger;

    public CreateContactRequestCommandHandler(
        IAppDbContext db,
        IEmailSender email,
        ILogger<CreateContactRequestCommandHandler> logger)
    {
        _db = db;
        _email = email;
        _logger = logger;
    }

    private static readonly Regex UrlRegex =
        new(@"https?://|www\.", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public async Task<ContactResponseDto> Handle(CreateContactRequestCommand request, CancellationToken ct)
    {
        // 1) Honeypot: bot doldurduysa basariliymis gibi don, kaydetme.
        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            _logger.LogWarning("Honeypot tetiklendi, iletisim talebi yok sayildi.");
            return SilentOk();
        }

        // 2) Cok hizli gonderim (bot): form yuklenmesinden < 2sn sonra gelmis.
        if (DateTime.TryParse(request.FormLoadedAt, null,
                System.Globalization.DateTimeStyles.RoundtripKind, out var loadedAt))
        {
            if ((DateTime.UtcNow - loadedAt.ToUniversalTime()).TotalSeconds < 2)
            {
                _logger.LogWarning("Cok hizli form gonderimi reddedildi (spam).");
                return SilentOk();
            }
        }

        // 3) Mesajda asiri link (spam).
        if (UrlRegex.Matches(request.Message).Count > 3)
        {
            _logger.LogWarning("Asiri link iceren mesaj reddedildi (spam).");
            return SilentOk();
        }

        // 4) Ayni email/telefon ile son 5 dk icinde tekrar gonderim engeli.
        var email = request.Email.Trim().ToLowerInvariant();
        var phone = request.Phone.Trim();
        var since = DateTime.UtcNow.AddMinutes(-5);
        var recentDuplicate = await _db.ContactRequests
            .AnyAsync(c => c.CreatedDate >= since
                && (c.Email.ToLower() == email || c.Phone == phone), ct);
        if (recentDuplicate)
        {
            throw new AppValidationException(new Dictionary<string, string[]>
            {
                ["message"] = new[] { "Kısa süre önce zaten bir talep gönderdiniz. Lütfen biraz sonra tekrar deneyin." },
            });
        }

        var entity = new ContactRequest
        {
            FullName = request.FullName.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            Company = request.Company.Trim(),
            ServiceType = request.ServiceType.Trim(),
            Message = request.Message.Trim(),
        };

        _db.ContactRequests.Add(entity);
        await _db.SaveChangesAsync(ct);

        var html = BuildEmailHtml(entity);
        await _email.SendAsync(
            subject: $"Yeni Talep: {entity.Company} — {entity.ServiceType}",
            htmlBody: html,
            replyTo: entity.Email,
            cancellationToken: ct);

        _logger.LogInformation("Yeni iletisim talebi kaydedildi: {Id}", entity.Id);

        return new ContactResponseDto
        {
            Success = true,
            Message = "Mesajınız Odak Ads Reklam ekibine iletildi.",
        };
    }

    // Bot/spam tespitinde, geri besleme vermemek icin sessizce basarili don.
    private static ContactResponseDto SilentOk() =>
        new() { Success = true, Message = "Mesajınız alındı." };

    private static string BuildEmailHtml(ContactRequest e)
    {
        string Enc(string v) => WebUtility.HtmlEncode(v);
        return $@"
<div style='font-family:Arial,sans-serif;color:#0f172a;'>
  <h2 style='color:#3b82f6;'>Yeni İletişim Talebi</h2>
  <table cellpadding='8' style='border-collapse:collapse;'>
    <tr><td><strong>Ad Soyad</strong></td><td>{Enc(e.FullName)}</td></tr>
    <tr><td><strong>Telefon</strong></td><td>{Enc(e.Phone)}</td></tr>
    <tr><td><strong>E-posta</strong></td><td>{Enc(e.Email)}</td></tr>
    <tr><td><strong>Firma</strong></td><td>{Enc(e.Company)}</td></tr>
    <tr><td><strong>Hizmet Türü</strong></td><td>{Enc(e.ServiceType)}</td></tr>
  </table>
  <p style='margin-top:16px;'><strong>Mesaj:</strong></p>
  <p style='white-space:pre-wrap;'>{Enc(e.Message)}</p>
</div>";
    }
}
