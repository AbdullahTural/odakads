namespace HasanHabibSeyda.Application.Features.CaseStudies.Commands;

/// <summary>Create/Update icin metrik girdisi (frontend metrics[] ile ayni).</summary>
public class CaseStudyMetricInput
{
    public string Label { get; set; } = string.Empty;
    public string Before { get; set; } = string.Empty;
    public string After { get; set; } = string.Empty;
}
