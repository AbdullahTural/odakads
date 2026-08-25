using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Application.Features.Blogs.Common;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Commands;

public record CreateBlogPostCommand : IRequest<BlogAdminDetailDto>, IBlogWriteCommand
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Excerpt { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string CoverImageUrl { get; init; } = string.Empty;
    public string CoverImageAlt { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public List<string> Tags { get; init; } = new();
    public string Author { get; init; } = string.Empty;
    public string Status { get; init; } = BlogStatuses.Draft;
    public DateTime? PublishedAt { get; init; }
    public string SeoTitle { get; init; } = string.Empty;
    public string SeoDescription { get; init; } = string.Empty;
    public string CanonicalUrl { get; init; } = string.Empty;
    public string OgTitle { get; init; } = string.Empty;
    public string OgDescription { get; init; } = string.Empty;
    public string OgImageUrl { get; init; } = string.Empty;
    public bool NoIndex { get; init; }
}

public class CreateBlogPostCommandValidator : BlogWriteCommandValidator<CreateBlogPostCommand>
{
}

public class CreateBlogPostCommandHandler : IRequestHandler<CreateBlogPostCommand, BlogAdminDetailDto>
{
    private readonly IAppDbContext _db;

    public CreateBlogPostCommandHandler(IAppDbContext db) => _db = db;

    public async Task<BlogAdminDetailDto> Handle(CreateBlogPostCommand request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var entity = new BlogPost { CreatedDate = now };
        BlogWrite.Apply(entity, request, now);

        if (string.IsNullOrEmpty(entity.Slug))
            throw new AppValidationException(new Dictionary<string, string[]>
            {
                ["slug"] = new[] { "Geçerli bir slug üretilemedi. Lütfen başlık veya slug girin." },
            });

        var slugTaken = await _db.BlogPosts.AnyAsync(x => x.Slug == entity.Slug, ct);
        if (slugTaken)
            throw new AppValidationException(new Dictionary<string, string[]>
            {
                ["slug"] = new[] { "Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin." },
            });

        _db.BlogPosts.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToAdminDetailDto();
    }
}
