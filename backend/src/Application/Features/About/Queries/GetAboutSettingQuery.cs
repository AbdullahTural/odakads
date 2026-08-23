using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.About.Queries;

public record GetAboutSettingQuery : IRequest<AboutSettingDto?>;

public class GetAboutSettingQueryHandler : IRequestHandler<GetAboutSettingQuery, AboutSettingDto?>
{
    private readonly IAppDbContext _db;

    public GetAboutSettingQueryHandler(IAppDbContext db) => _db = db;

    public Task<AboutSettingDto?> Handle(GetAboutSettingQuery request, CancellationToken ct) =>
        _db.AboutSettings.AsNoTracking()
            .Select(s => new AboutSettingDto
            {
                Id = s.Id,
                FounderName = s.FounderName,
                FounderTitle = s.FounderTitle,
                FounderDescription = s.FounderDescription,
                CompanyStory = s.CompanyStory,
                MissionText = s.MissionText,
                VisionText = s.VisionText,
            })
            .FirstOrDefaultAsync(ct);
}
