using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Values.Queries;

public record GetValuesQuery : IRequest<List<ValueDto>>;

public class GetValuesQueryHandler : IRequestHandler<GetValuesQuery, List<ValueDto>>
{
    private readonly IAppDbContext _db;

    public GetValuesQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<ValueDto>> Handle(GetValuesQuery request, CancellationToken ct) =>
        _db.CompanyValues
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ValueDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
            })
            .ToListAsync(ct);
}
