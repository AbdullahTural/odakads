using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Seo.Queries;

/// <summary>Tek sayfanin SEO ayari (admin + public).</summary>
public record GetSeoSettingByKeyQuery(string PageKey) : IRequest<SeoSettingDto>;

public class GetSeoSettingByKeyQueryHandler : IRequestHandler<GetSeoSettingByKeyQuery, SeoSettingDto>
{
    private readonly IAppDbContext _db;

    public GetSeoSettingByKeyQueryHandler(IAppDbContext db) => _db = db;

    public async Task<SeoSettingDto> Handle(GetSeoSettingByKeyQuery request, CancellationToken ct)
    {
        var key = request.PageKey.Trim().ToLowerInvariant();
        return await _db.SeoSettings.AsNoTracking()
            .Where(s => s.PageKey == key)
            .Select(s => new SeoSettingDto
            {
                Id = s.Id,
                PageKey = s.PageKey,
                PageName = s.PageName,
                Title = s.Title,
                Description = s.Description,
                Keywords = s.Keywords,
                CanonicalUrl = s.CanonicalUrl,
                IsActive = s.IsActive,
                UpdatedDate = s.UpdatedDate,
            })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("SEO ayarı", request.PageKey);
    }
}
