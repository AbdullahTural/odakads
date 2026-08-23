using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Conversion.Queries;

public record GetConversionSettingQuery : IRequest<ConversionSettingDto?>;

public class GetConversionSettingQueryHandler : IRequestHandler<GetConversionSettingQuery, ConversionSettingDto?>
{
    private readonly IAppDbContext _db;

    public GetConversionSettingQueryHandler(IAppDbContext db) => _db = db;

    public Task<ConversionSettingDto?> Handle(GetConversionSettingQuery request, CancellationToken ct) =>
        _db.ConversionSettings.AsNoTracking()
            .Select(s => new ConversionSettingDto
            {
                Id = s.Id,
                WhatsappPhoneNumber = s.WhatsappPhoneNumber,
                WhatsappDefaultMessage = s.WhatsappDefaultMessage,
                IsWhatsappEnabled = s.IsWhatsappEnabled,
                IsClickToCallEnabled = s.IsClickToCallEnabled,
                CalendlyUrl = s.CalendlyUrl,
                IsCalendlyEnabled = s.IsCalendlyEnabled,
                PrimaryCtaText = s.PrimaryCtaText,
                PrimaryCtaUrl = s.PrimaryCtaUrl,
                SecondaryCtaText = s.SecondaryCtaText,
                SecondaryCtaUrl = s.SecondaryCtaUrl,
            })
            .FirstOrDefaultAsync(ct);
}
