using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Dashboard.Queries;

public record GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IAppDbContext _db;

    public GetDashboardSummaryQueryHandler(IAppDbContext db) => _db = db;

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken ct)
    {
        var totalLeads = await _db.ContactRequests.CountAsync(ct);
        var unread = await _db.ContactRequests.CountAsync(c => !c.IsRead, ct);

        var latestContacts = await _db.ContactRequests.AsNoTracking()
            .OrderByDescending(c => c.CreatedDate)
            .Take(5)
            .ToListAsync(ct);

        // Son 30 gun lead grafigi
        var today = DateTime.UtcNow.Date;
        var fromDate = today.AddDays(-29);
        var recentDates = await _db.ContactRequests.AsNoTracking()
            .Where(c => c.CreatedDate >= fromDate)
            .Select(c => c.CreatedDate)
            .ToListAsync(ct);

        var grouped = recentDates
            .GroupBy(d => d.Date)
            .ToDictionary(g => g.Key, g => g.Count());

        var leadChart = Enumerable.Range(0, 30)
            .Select(offset =>
            {
                var date = fromDate.AddDays(offset);
                return new LeadChartPointDto
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Count = grouped.TryGetValue(date, out var c) ? c : 0,
                };
            })
            .ToList();

        return new DashboardSummaryDto
        {
            TotalLeads = totalLeads,
            UnreadLeads = unread,
            ReadLeads = totalLeads - unread,
            TotalCaseStudies = await _db.CaseStudies.CountAsync(ct),
            ActiveServices = await _db.Services.CountAsync(s => s.IsActive, ct),
            LatestContactRequests = latestContacts.Select(c => c.ToDto()).ToList(),
            LeadChart = leadChart,
        };
    }
}
