using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Queries;

public record GetCaseStudiesPagedQuery(QueryParameters Parameters) : IRequest<PagedResult<CaseStudyDto>>;

public class GetCaseStudiesPagedQueryHandler
    : IRequestHandler<GetCaseStudiesPagedQuery, PagedResult<CaseStudyDto>>
{
    private readonly IAppDbContext _db;

    public GetCaseStudiesPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<CaseStudyDto>> Handle(GetCaseStudiesPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.CaseStudies.AsNoTracking().Include(c => c.Metrics).AsQueryable();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Client, $"%{s}%") ||
                EF.Functions.Like(x.Industry, $"%{s}%") ||
                EF.Functions.Like(x.Summary, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "client" => p.IsDescending ? query.OrderByDescending(x => x.Client) : query.OrderBy(x => x.Client),
            _ => p.IsDescending ? query.OrderByDescending(x => x.DisplayOrder) : query.OrderBy(x => x.DisplayOrder),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<CaseStudyDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
