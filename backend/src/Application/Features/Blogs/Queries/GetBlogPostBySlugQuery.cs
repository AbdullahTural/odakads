using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>Public tek yazi (yalnizca yayinda). Build-time detay ve /blog/{slug} icin.</summary>
public record GetBlogPostBySlugQuery(string Slug) : IRequest<BlogDetailDto>;

public class GetBlogPostBySlugQueryHandler : IRequestHandler<GetBlogPostBySlugQuery, BlogDetailDto>
{
    private readonly IAppDbContext _db;

    public GetBlogPostBySlugQueryHandler(IAppDbContext db) => _db = db;

    public async Task<BlogDetailDto> Handle(GetBlogPostBySlugQuery request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var entity = await _db.BlogPosts.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == request.Slug
                                      && x.Status == BlogStatuses.Published
                                      && x.PublishedAt != null
                                      && x.PublishedAt <= now, ct)
            ?? throw new NotFoundException("Blog yazısı", request.Slug);

        return entity.ToDetailDto();
    }
}
