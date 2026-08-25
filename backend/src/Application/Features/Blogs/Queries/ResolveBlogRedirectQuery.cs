using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Queries;

/// <summary>
/// Eski (degistirilmis) bir slug icin gecerli slug'i cozer — 301 yonlendirme kaynagi.
/// Yalnizca yayindaki yazilarin PreviousSlugs listesine bakar. Bulunmazsa null.
/// </summary>
public record ResolveBlogRedirectQuery(string Slug) : IRequest<string?>;

public class ResolveBlogRedirectQueryHandler : IRequestHandler<ResolveBlogRedirectQuery, string?>
{
    private readonly IAppDbContext _db;

    public ResolveBlogRedirectQueryHandler(IAppDbContext db) => _db = db;

    public async Task<string?> Handle(ResolveBlogRedirectQuery request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Slug)) return null;

        var now = DateTime.UtcNow;
        // Yayindaki yazilari yukle (kucuk kume); PreviousSlugs JSON kolonu bellek icinde taranir.
        var candidates = await _db.BlogPosts.AsNoTracking()
            .Where(x => x.Status == BlogStatuses.Published
                        && x.PublishedAt != null
                        && x.PublishedAt <= now)
            .Select(x => new { x.Slug, x.PreviousSlugs })
            .ToListAsync(ct);

        var match = candidates.FirstOrDefault(c =>
            c.Slug != request.Slug && c.PreviousSlugs.Contains(request.Slug));

        return match?.Slug;
    }
}
