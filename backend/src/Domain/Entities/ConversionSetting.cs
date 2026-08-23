using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>WhatsApp / Calendly / CTA donusum ayarlari (tekil kayit).</summary>
public class ConversionSetting : BaseEntity
{
    public string? WhatsappPhoneNumber { get; set; }
    public string? WhatsappDefaultMessage { get; set; }
    public bool IsWhatsappEnabled { get; set; }

    /// <summary>Sag alttaki telefon (click-to-call) butonu. Numara SiteSettings.Phone'dan gelir.</summary>
    public bool IsClickToCallEnabled { get; set; }

    public string? CalendlyUrl { get; set; }
    public bool IsCalendlyEnabled { get; set; }

    public string PrimaryCtaText { get; set; } = string.Empty;
    public string PrimaryCtaUrl { get; set; } = string.Empty;
    public string SecondaryCtaText { get; set; } = string.Empty;
    public string SecondaryCtaUrl { get; set; } = string.Empty;

    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}
