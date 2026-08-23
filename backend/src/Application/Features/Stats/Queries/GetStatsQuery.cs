using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Stats.Queries;

public record GetStatsQuery : IRequest<List<StatDto>>;

public class GetStatsQueryHandler : IRequestHandler<GetStatsQuery, List<StatDto>>
{
    private readonly IAppDbContext _db;

    public GetStatsQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<StatDto>> Handle(GetStatsQuery request, CancellationToken ct) =>
        _db.Stats
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StatDto
            {
                Id = s.Id,
                Label = s.Label,
                Value = s.Value,
                Suffix = s.Suffix,
                Prefix = s.Prefix,
                Icon = s.Icon,
            })
            .ToListAsync(ct);
}
