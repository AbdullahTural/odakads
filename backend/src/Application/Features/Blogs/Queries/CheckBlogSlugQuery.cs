using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Blogs.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>Slug musaitlik kontrolu (admin editor canli dogrulamasi).</summary>
public record CheckBlogSlugQuery(string Slug, Guid? ExcludeId) : IRequest<BlogSlugCheckDto>;

public class CheckBlogSlugQueryHandler : IRequestHandler<CheckBlogSlugQuery, BlogSlugCheckDto>
{
    private readonly IAppDbContext _db;

    public CheckBlogSlugQueryHandler(IAppDbContext db) => _db = db;

    public async Task<BlogSlugCheckDto> Handle(CheckBlogSlugQuery request, CancellationToken ct)
    {
        var slug = BlogWrite.Slugify(request.Slug);
        if (string.IsNullOrEmpty(slug))
            return new BlogSlugCheckDto(slug, false);

        var taken = await _db.BlogPosts.AsNoTracking()
            .AnyAsync(x => x.Slug == slug && (request.ExcludeId == null || x.Id != request.ExcludeId), ct);

        return new BlogSlugCheckDto(slug, !taken);
    }
}
