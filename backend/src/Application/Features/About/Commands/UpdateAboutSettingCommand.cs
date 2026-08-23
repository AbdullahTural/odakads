using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.About.Commands;

public record UpdateAboutSettingCommand : IRequest<AboutSettingDto>
{
    public string CompanyStory { get; init; } = string.Empty;
    public string MissionText { get; init; } = string.Empty;
    public string VisionText { get; init; } = string.Empty;
}

public class UpdateAboutSettingCommandValidator : AbstractValidator<UpdateAboutSettingCommand>
{
    public UpdateAboutSettingCommandValidator()
    {
        RuleFor(x => x.CompanyStory).MaximumLength(3000);
        RuleFor(x => x.MissionText).MaximumLength(1500);
        RuleFor(x => x.VisionText).MaximumLength(1500);
    }
}

public class UpdateAboutSettingCommandHandler : IRequestHandler<UpdateAboutSettingCommand, AboutSettingDto>
{
    private readonly IAppDbContext _db;

    public UpdateAboutSettingCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AboutSettingDto> Handle(UpdateAboutSettingCommand request, CancellationToken ct)
    {
        var entity = await _db.AboutSettings.FirstOrDefaultAsync(ct);
        if (entity is null)
        {
            entity = new AboutSetting();
            _db.AboutSettings.Add(entity);
        }

        entity.FounderName = string.Empty;
        entity.FounderTitle = string.Empty;
        entity.FounderDescription = string.Empty;
        entity.CompanyStory = request.CompanyStory.Trim();
        entity.MissionText = request.MissionText.Trim();
        entity.VisionText = request.VisionText.Trim();
        entity.UpdatedDate = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
