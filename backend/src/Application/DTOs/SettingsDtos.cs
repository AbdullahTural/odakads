namespace HasanHabibSeyda.Application.DTOs;

public class SeoSettingDto
{
    public Guid Id { get; set; }
    public string PageKey { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string CanonicalUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime UpdatedDate { get; set; }
}

public class AnalyticsSettingDto
{
    public Guid Id { get; set; }
    public string? GoogleAnalyticsMeasurementId { get; set; }
    public string? GoogleTagManagerId { get; set; }
    public string? GoogleSearchConsoleVerificationCode { get; set; }
    public string? MicrosoftClarityProjectId { get; set; }
    public string? MetaPixelId { get; set; }
    public string? LinkedinInsightTagPartnerId { get; set; }
    public bool IsActive { get; set; }
}

public class ConversionSettingDto
{
    public Guid Id { get; set; }
    public string? WhatsappPhoneNumber { get; set; }
    public string? WhatsappDefaultMessage { get; set; }
    public bool IsWhatsappEnabled { get; set; }
    public bool IsClickToCallEnabled { get; set; }
    public string? CalendlyUrl { get; set; }
    public bool IsCalendlyEnabled { get; set; }
    public string PrimaryCtaText { get; set; } = string.Empty;
    public string PrimaryCtaUrl { get; set; } = string.Empty;
    public string SecondaryCtaText { get; set; } = string.Empty;
    public string SecondaryCtaUrl { get; set; } = string.Empty;
}

public class AboutSettingDto
{
    public Guid Id { get; set; }
    public string FounderName { get; set; } = string.Empty;
    public string FounderTitle { get; set; } = string.Empty;
    public string FounderDescription { get; set; } = string.Empty;
    public string CompanyStory { get; set; } = string.Empty;
    public string MissionText { get; set; } = string.Empty;
    public string VisionText { get; set; } = string.Empty;
}
