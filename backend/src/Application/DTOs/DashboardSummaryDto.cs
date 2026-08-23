namespace HasanHabibSeyda.Application.DTOs;

public class LeadChartPointDto
{
    public string Date { get; set; } = string.Empty; // yyyy-MM-dd
    public int Count { get; set; }
}

public class DashboardSummaryDto
{
    public int TotalLeads { get; set; }
    public int UnreadLeads { get; set; }
    public int ReadLeads { get; set; }
    public int TotalCaseStudies { get; set; }
    public int ActiveServices { get; set; }
    public List<ContactRequestDto> LatestContactRequests { get; set; } = new();
    public List<LeadChartPointDto> LeadChart { get; set; } = new();
}
