using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Services.Queries;

/// <summary>Public: aktif hizmetleri DisplayOrder'a gore dizi olarak doner.</summary>
public record GetServicesQuery : IRequest<List<ServiceDto>>;

public class GetServicesQueryHandler : IRequestHandler<GetServicesQuery, List<ServiceDto>>
{
    private readonly IAppDbContext _db;

    public GetServicesQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<ServiceDto>> Handle(GetServicesQuery request, CancellationToken ct) =>
        _db.Services
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Slug = s.Slug,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
                Features = s.Features,
                Order = s.DisplayOrder,
                IsActive = s.IsActive,
            })
            .ToListAsync(ct);
}
