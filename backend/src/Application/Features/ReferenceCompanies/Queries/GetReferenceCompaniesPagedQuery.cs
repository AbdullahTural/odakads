using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Queries;

public record GetReferenceCompaniesPagedQuery(QueryParameters Parameters)
    : IRequest<PagedResult<ReferenceCompanyDto>>;

public class GetReferenceCompaniesPagedQueryHandler
    : IRequestHandler<GetReferenceCompaniesPagedQuery, PagedResult<ReferenceCompanyDto>>
{
    private readonly IAppDbContext _db;

    public GetReferenceCompaniesPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ReferenceCompanyDto>> Handle(GetReferenceCompaniesPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.ReferenceCompanies.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x => EF.Functions.Like(x.Name, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "name" => p.IsDescending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
            _ => p.IsDescending ? query.OrderByDescending(x => x.DisplayOrder) : query.OrderBy(x => x.DisplayOrder),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<ReferenceCompanyDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
