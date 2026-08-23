using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.SiteSettings.Queries;

public record GetSiteSettingsQuery : IRequest<SiteSettingsDto>;

public class GetSiteSettingsQueryHandler : IRequestHandler<GetSiteSettingsQuery, SiteSettingsDto>
{
    private readonly IAppDbContext _db;

    public GetSiteSettingsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<SiteSettingsDto> Handle(GetSiteSettingsQuery request, CancellationToken ct) =>
        await _db.SiteSettings.AsNoTracking()
            .Select(s => new SiteSettingsDto
            {
                Id = s.Id,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                GoogleMapEmbed = s.GoogleMapEmbed,
                FacebookUrl = s.FacebookUrl,
                InstagramUrl = s.InstagramUrl,
                LinkedinUrl = s.LinkedinUrl,
            })
            .FirstOrDefaultAsync(ct)
        ?? throw new NotFoundException("Site ayarları bulunamadı.");
}
