using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Analytics.Commands;

/// <summary>Sadece ID degerleri alinir (serbest script YOK).</summary>
public record UpdateAnalyticsSettingCommand : IRequest<AnalyticsSettingDto>
{
    public string? GoogleAnalyticsMeasurementId { get; init; }
    public string? GoogleTagManagerId { get; init; }
    public string? GoogleSearchConsoleVerificationCode { get; init; }
    public string? MicrosoftClarityProjectId { get; init; }
    public string? MetaPixelId { get; init; }
    public string? LinkedinInsightTagPartnerId { get; init; }
    public bool IsActive { get; init; }
}

public class UpdateAnalyticsSettingCommandValidator : AbstractValidator<UpdateAnalyticsSettingCommand>
{
    public UpdateAnalyticsSettingCommandValidator()
    {
        // ID'ler script icermemeli (XSS korumasi)
        RuleFor(x => x.GoogleAnalyticsMeasurementId).MaximumLength(60).Must(NoAngle);
        RuleFor(x => x.GoogleTagManagerId).MaximumLength(60).Must(NoAngle);
        RuleFor(x => x.GoogleSearchConsoleVerificationCode).MaximumLength(200).Must(NoAngle);
        RuleFor(x => x.MicrosoftClarityProjectId).MaximumLength(60).Must(NoAngle);
        RuleFor(x => x.MetaPixelId).MaximumLength(60).Must(NoAngle);
        RuleFor(x => x.LinkedinInsightTagPartnerId).MaximumLength(60).Must(NoAngle);
    }

    private static bool NoAngle(string? v) =>
        string.IsNullOrEmpty(v) || (!v.Contains('<') && !v.Contains('>'));
}

public class UpdateAnalyticsSettingCommandHandler
    : IRequestHandler<UpdateAnalyticsSettingCommand, AnalyticsSettingDto>
{
    private readonly IAppDbContext _db;

    public UpdateAnalyticsSettingCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AnalyticsSettingDto> Handle(UpdateAnalyticsSettingCommand request, CancellationToken ct)
    {
        var entity = await _db.AnalyticsSettings.FirstOrDefaultAsync(ct);
        if (entity is null)
        {
            entity = new AnalyticsSetting { CreatedDate = DateTime.UtcNow };
            _db.AnalyticsSettings.Add(entity);
        }

        entity.GoogleAnalyticsMeasurementId = request.GoogleAnalyticsMeasurementId?.Trim();
        entity.GoogleTagManagerId = request.GoogleTagManagerId?.Trim();
        entity.GoogleSearchConsoleVerificationCode = request.GoogleSearchConsoleVerificationCode?.Trim();
        entity.MicrosoftClarityProjectId = request.MicrosoftClarityProjectId?.Trim();
        entity.MetaPixelId = request.MetaPixelId?.Trim();
        entity.LinkedinInsightTagPartnerId = request.LinkedinInsightTagPartnerId?.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedDate = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
