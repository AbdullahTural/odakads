using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Hakkimizda sayfasi metin ayarlari (tekil kayit). Gorsel alan YOK.</summary>
public class AboutSetting : BaseEntity
{
    public string FounderName { get; set; } = string.Empty;
    public string FounderTitle { get; set; } = string.Empty;
    public string FounderDescription { get; set; } = string.Empty;
    public string CompanyStory { get; set; } = string.Empty;
    public string MissionText { get; set; } = string.Empty;
    public string VisionText { get; set; } = string.Empty;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}
