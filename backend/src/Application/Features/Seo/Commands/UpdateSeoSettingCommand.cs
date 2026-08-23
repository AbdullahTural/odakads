using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Seo.Commands;

public record UpdateSeoSettingCommand : IRequest<SeoSettingDto>
{
    public string PageKey { get; init; } = string.Empty;
    public string PageName { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Keywords { get; init; } = string.Empty;
    public string CanonicalUrl { get; init; } = string.Empty;
    public bool IsActive { get; init; } = true;
}

public class UpdateSeoSettingCommandValidator : AbstractValidator<UpdateSeoSettingCommand>
{
    public UpdateSeoSettingCommandValidator()
    {
        RuleFor(x => x.PageKey).NotEmpty().MaximumLength(40);
        RuleFor(x => x.PageName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Title).MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(400);
        RuleFor(x => x.Keywords).MaximumLength(400);
        RuleFor(x => x.CanonicalUrl).MaximumLength(300);
    }
}

public class UpdateSeoSettingCommandHandler : IRequestHandler<UpdateSeoSettingCommand, SeoSettingDto>
{
    private readonly IAppDbContext _db;

    public UpdateSeoSettingCommandHandler(IAppDbContext db) => _db = db;

    public async Task<SeoSettingDto> Handle(UpdateSeoSettingCommand request, CancellationToken ct)
    {
        var key = request.PageKey.Trim().ToLowerInvariant();
        var entity = await _db.SeoSettings.FirstOrDefaultAsync(s => s.PageKey == key, ct);
        if (entity is null)
        {
            entity = new SeoSetting { PageKey = key, CreatedDate = DateTime.UtcNow };
            _db.SeoSettings.Add(entity);
        }

        entity.PageName = request.PageName.Trim();
        entity.Title = request.Title.Trim();
        entity.Description = request.Description.Trim();
        entity.Keywords = request.Keywords.Trim();
        entity.CanonicalUrl = request.CanonicalUrl.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedDate = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
