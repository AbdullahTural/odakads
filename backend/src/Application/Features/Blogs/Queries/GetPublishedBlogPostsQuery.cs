using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>
/// Public yayindaki yazilar (duz liste, yayin tarihine gore azalan).
/// Yalnizca Published + gecmis PublishedAt. Build-time SSG ve /blog listesi icin.
/// </summary>
public record GetPublishedBlogPostsQuery : IRequest<List<BlogListItemDto>>;

public class GetPublishedBlogPostsQueryHandler
    : IRequestHandler<GetPublishedBlogPostsQuery, List<BlogListItemDto>>
{
    private readonly IAppDbContext _db;

    public GetPublishedBlogPostsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<BlogListItemDto>> Handle(GetPublishedBlogPostsQuery request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var items = await _db.BlogPosts.AsNoTracking()
            .Where(x => x.Status == BlogStatuses.Published
                        && x.PublishedAt != null
                        && x.PublishedAt <= now)
            .OrderByDescending(x => x.PublishedAt)
            .ToListAsync(ct);

        return items.Select(x => x.ToListItemDto()).ToList();
    }
}
