using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>Basari hikayesi / vaka calismasi. Frontend CaseStudyDto ile birebir.</summary>
public class CaseStudy : BaseEntity
{
    public string Client { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Growth { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public List<CaseStudyMetric> Metrics { get; set; } = new();
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>Vaka calismasi once/sonra metrigi (CaseStudy'ye ait owned koleksiyon).</summary>
public class CaseStudyMetric : BaseEntity
{
    public Guid CaseStudyId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Before { get; set; } = string.Empty;
    public string After { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
