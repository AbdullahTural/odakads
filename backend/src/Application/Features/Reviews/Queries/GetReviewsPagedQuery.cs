using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Reviews.Queries;

public record GetReviewsPagedQuery(QueryParameters Parameters) : IRequest<PagedResult<ReviewDto>>;

public class GetReviewsPagedQueryHandler
    : IRequestHandler<GetReviewsPagedQuery, PagedResult<ReviewDto>>
{
    private readonly IAppDbContext _db;

    public GetReviewsPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ReviewDto>> Handle(GetReviewsPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.Reviews.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Author, $"%{s}%") ||
                EF.Functions.Like(x.Service, $"%{s}%") ||
                EF.Functions.Like(x.Comment, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "author" => p.IsDescending ? query.OrderByDescending(x => x.Author) : query.OrderBy(x => x.Author),
            "date" => p.IsDescending ? query.OrderByDescending(x => x.Date) : query.OrderBy(x => x.Date),
            "rating" => p.IsDescending ? query.OrderByDescending(x => x.Rating) : query.OrderBy(x => x.Rating),
            _ => p.IsDescending ? query.OrderByDescending(x => x.Date) : query.OrderBy(x => x.Date),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<ReviewDto>(
            paged.Items.Select(x => x.ToDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
