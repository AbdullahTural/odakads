using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Services.Queries;

/// <summary>Admin: sayfalama + arama + siralama ile hizmet listesi.</summary>
public record GetServicesPagedQuery(QueryParameters Parameters) : IRequest<PagedResult<ServiceDto>>;

public class GetServicesPagedQueryHandler
    : IRequestHandler<GetServicesPagedQuery, PagedResult<ServiceDto>>
{
    private readonly IAppDbContext _db;

    public GetServicesPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ServiceDto>> Handle(GetServicesPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.Services.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Title, $"%{s}%") ||
                EF.Functions.Like(x.Description, $"%{s}%") ||
                EF.Functions.Like(x.Slug, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "title" => p.IsDescending ? query.OrderByDescending(x => x.Title) : query.OrderBy(x => x.Title),
            "createddate" => p.IsDescending ? query.OrderByDescending(x => x.CreatedDate) : query.OrderBy(x => x.CreatedDate),
            _ => p.IsDescending ? query.OrderByDescending(x => x.DisplayOrder) : query.OrderBy(x => x.DisplayOrder),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<ServiceDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
