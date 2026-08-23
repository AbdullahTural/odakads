using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Conversion.Commands;

public record UpdateConversionSettingCommand : IRequest<ConversionSettingDto>
{
    public string? WhatsappPhoneNumber { get; init; }
    public string? WhatsappDefaultMessage { get; init; }
    public bool IsWhatsappEnabled { get; init; }
    public bool IsClickToCallEnabled { get; init; }
    public string? CalendlyUrl { get; init; }
    public bool IsCalendlyEnabled { get; init; }
    public string PrimaryCtaText { get; init; } = string.Empty;
    public string PrimaryCtaUrl { get; init; } = string.Empty;
    public string SecondaryCtaText { get; init; } = string.Empty;
    public string SecondaryCtaUrl { get; init; } = string.Empty;
}

public class UpdateConversionSettingCommandValidator : AbstractValidator<UpdateConversionSettingCommand>
{
    public UpdateConversionSettingCommandValidator()
    {
        RuleFor(x => x.WhatsappPhoneNumber).MaximumLength(30);
        RuleFor(x => x.WhatsappDefaultMessage).MaximumLength(500);
        RuleFor(x => x.CalendlyUrl).MaximumLength(300);
        RuleFor(x => x.PrimaryCtaText).MaximumLength(80);
        RuleFor(x => x.PrimaryCtaUrl).MaximumLength(300);
        RuleFor(x => x.SecondaryCtaText).MaximumLength(80);
        RuleFor(x => x.SecondaryCtaUrl).MaximumLength(300);
        RuleFor(x => x.WhatsappPhoneNumber)
            .NotEmpty().When(x => x.IsWhatsappEnabled)
            .WithMessage("WhatsApp aktifken telefon numarası zorunludur.");
    }
}

public class UpdateConversionSettingCommandHandler
    : IRequestHandler<UpdateConversionSettingCommand, ConversionSettingDto>
{
    private readonly IAppDbContext _db;

    public UpdateConversionSettingCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ConversionSettingDto> Handle(UpdateConversionSettingCommand request, CancellationToken ct)
    {
        var entity = await _db.ConversionSettings.FirstOrDefaultAsync(ct);
        if (entity is null)
        {
            entity = new ConversionSetting();
            _db.ConversionSettings.Add(entity);
        }

        entity.WhatsappPhoneNumber = request.WhatsappPhoneNumber?.Trim();
        entity.WhatsappDefaultMessage = request.WhatsappDefaultMessage?.Trim();
        entity.IsWhatsappEnabled = request.IsWhatsappEnabled;
        entity.IsClickToCallEnabled = request.IsClickToCallEnabled;
        entity.CalendlyUrl = request.CalendlyUrl?.Trim();
        entity.IsCalendlyEnabled = request.IsCalendlyEnabled;
        entity.PrimaryCtaText = request.PrimaryCtaText.Trim();
        entity.PrimaryCtaUrl = request.PrimaryCtaUrl.Trim();
        entity.SecondaryCtaText = request.SecondaryCtaText.Trim();
        entity.SecondaryCtaUrl = request.SecondaryCtaUrl.Trim();
        entity.UpdatedDate = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
