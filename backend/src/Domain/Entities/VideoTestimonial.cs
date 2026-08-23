using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Video referans. Frontend VideoTestimonialDto ile birebir.</summary>
public class VideoTestimonial : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
