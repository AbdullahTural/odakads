using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Seo.Queries;

/// <summary>Admin: tum sayfa SEO ayarlari.</summary>
public record GetSeoSettingsQuery : IRequest<List<SeoSettingDto>>;

public class GetSeoSettingsQueryHandler : IRequestHandler<GetSeoSettingsQuery, List<SeoSettingDto>>
{
    private readonly IAppDbContext _db;

    public GetSeoSettingsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<SeoSettingDto>> Handle(GetSeoSettingsQuery request, CancellationToken ct)
    {
        var items = await _db.SeoSettings
            .AsNoTracking()
            .OrderBy(s => s.CreatedDate)
            .ToListAsync(ct);
        return items.Select(s => s.ToDto()).ToList();
    }
}
