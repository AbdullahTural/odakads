using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Takip kodlari (tekil kayit). Sadece ID degerleri tutulur, serbest script tutulmaz.</summary>
public class AnalyticsSetting : BaseEntity
{
    public string? GoogleAnalyticsMeasurementId { get; set; }
    public string? GoogleTagManagerId { get; set; }
    public string? GoogleSearchConsoleVerificationCode { get; set; }
    public string? MicrosoftClarityProjectId { get; set; }
    public string? MetaPixelId { get; set; }
    public string? LinkedinInsightTagPartnerId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}
