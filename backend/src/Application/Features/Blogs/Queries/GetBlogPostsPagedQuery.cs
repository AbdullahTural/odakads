using HasanHabibSeyda.Application.Common.Extensions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.Common.Models;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>Admin blog listesi — tum durumlar; opsiyonel durum filtresi + arama + siralama.</summary>
public record GetBlogPostsPagedQuery(QueryParameters Parameters, string? Status)
    : IRequest<PagedResult<BlogAdminListItemDto>>;

public class GetBlogPostsPagedQueryHandler
    : IRequestHandler<GetBlogPostsPagedQuery, PagedResult<BlogAdminListItemDto>>
{
    private readonly IAppDbContext _db;

    public GetBlogPostsPagedQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<BlogAdminListItemDto>> Handle(GetBlogPostsPagedQuery request, CancellationToken ct)
    {
        var p = request.Parameters;
        var query = _db.BlogPosts.AsNoTracking().AsQueryable();

        if (BlogStatuses.IsValid(request.Status))
            query = query.Where(x => x.Status == request.Status);

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Title, $"%{s}%") ||
                EF.Functions.Like(x.Slug, $"%{s}%") ||
                EF.Functions.Like(x.Category, $"%{s}%") ||
                EF.Functions.Like(x.Author, $"%{s}%"));
        }

        query = (p.SortBy?.ToLowerInvariant()) switch
        {
            "title" => p.IsDescending ? query.OrderByDescending(x => x.Title) : query.OrderBy(x => x.Title),
            "publishedat" => p.IsDescending
                ? query.OrderByDescending(x => x.PublishedAt)
                : query.OrderBy(x => x.PublishedAt),
            _ => query.OrderByDescending(x => x.UpdatedDate),
        };

        var paged = await query.ToPagedResultAsync(p.Page, p.PageSize, ct);
        return new PagedResult<BlogAdminListItemDto>(
            paged.Items.Select(x => x.ToAdminListItemDto()).ToList(),
            paged.Page, paged.PageSize, paged.TotalCount);
    }
}
