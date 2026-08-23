using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Surec adimi. Frontend ProcessStepDto ile birebir.</summary>
public class ProcessStep : BaseEntity
{
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
