using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Analytics.Queries;

public record GetAnalyticsSettingQuery : IRequest<AnalyticsSettingDto?>;

public class GetAnalyticsSettingQueryHandler : IRequestHandler<GetAnalyticsSettingQuery, AnalyticsSettingDto?>
{
    private readonly IAppDbContext _db;

    public GetAnalyticsSettingQueryHandler(IAppDbContext db) => _db = db;

    public Task<AnalyticsSettingDto?> Handle(GetAnalyticsSettingQuery request, CancellationToken ct) =>
        _db.AnalyticsSettings.AsNoTracking()
            .Select(s => new AnalyticsSettingDto
            {
                Id = s.Id,
                GoogleAnalyticsMeasurementId = s.GoogleAnalyticsMeasurementId,
                GoogleTagManagerId = s.GoogleTagManagerId,
                GoogleSearchConsoleVerificationCode = s.GoogleSearchConsoleVerificationCode,
                MicrosoftClarityProjectId = s.MicrosoftClarityProjectId,
                MetaPixelId = s.MetaPixelId,
                LinkedinInsightTagPartnerId = s.LinkedinInsightTagPartnerId,
                IsActive = s.IsActive,
            })
            .FirstOrDefaultAsync(ct);
}
