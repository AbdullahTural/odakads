using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.SiteSettings.Commands;

public record UpdateSiteSettingsCommand : IRequest<SiteSettingsDto>
{
    public string Phone { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public string GoogleMapEmbed { get; init; } = string.Empty;
    public string FacebookUrl { get; init; } = string.Empty;
    public string InstagramUrl { get; init; } = string.Empty;
    public string LinkedinUrl { get; init; } = string.Empty;
}

public class UpdateSiteSettingsCommandValidator : AbstractValidator<UpdateSiteSettingsCommand>
{
    public UpdateSiteSettingsCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Address).MaximumLength(300);
    }
}

public class UpdateSiteSettingsCommandHandler : IRequestHandler<UpdateSiteSettingsCommand, SiteSettingsDto>
{
    private readonly IAppDbContext _db;

    public UpdateSiteSettingsCommandHandler(IAppDbContext db) => _db = db;

    public async Task<SiteSettingsDto> Handle(UpdateSiteSettingsCommand request, CancellationToken ct)
    {
        var entity = await _db.SiteSettings.FirstOrDefaultAsync(ct);
        if (entity is null)
        {
            entity = new Domain.Entities.SiteSettings();
            _db.SiteSettings.Add(entity);
        }

        entity.Phone = request.Phone.Trim();
        entity.Email = request.Email.Trim();
        entity.Address = request.Address.Trim();
        entity.GoogleMapEmbed = request.GoogleMapEmbed.Trim();
        entity.FacebookUrl = request.FacebookUrl.Trim();
        entity.InstagramUrl = request.InstagramUrl.Trim();
        entity.LinkedinUrl = request.LinkedinUrl.Trim();

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
