using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Queries;

public record GetReferenceCompaniesQuery : IRequest<List<ReferenceCompanyDto>>;

public class GetReferenceCompaniesQueryHandler : IRequestHandler<GetReferenceCompaniesQuery, List<ReferenceCompanyDto>>
{
    private readonly IAppDbContext _db;

    public GetReferenceCompaniesQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<ReferenceCompanyDto>> Handle(GetReferenceCompaniesQuery request, CancellationToken ct) =>
        await _db.ReferenceCompanies
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new ReferenceCompanyDto
            {
                Id = x.Id,
                Name = x.Name,
                LogoUrl = x.LogoUrl,
                DisplayOrder = x.DisplayOrder,
                IsActive = x.IsActive,
            })
            .ToListAsync(ct);
}
