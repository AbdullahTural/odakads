using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Armut platformu yorumu. Frontend ReviewDto ile birebir.</summary>
public class Review : BaseEntity
{
    public string Author { get; set; } = string.Empty;
    public string Service { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Source { get; set; } = "Armut";
    public string? CompanyLogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
