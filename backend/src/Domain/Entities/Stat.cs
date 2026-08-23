using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Istatistik / metrik. Frontend StatDto ile birebir.</summary>
public class Stat : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public string? Suffix { get; set; }
    public string? Prefix { get; set; }
    public string Icon { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
