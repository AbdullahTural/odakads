using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Commands;

public record UpdateCaseStudyCommand : IRequest<CaseStudyDto>
{
    public Guid Id { get; init; }
    public string Client { get; init; } = string.Empty;
    public string Industry { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Growth { get; init; } = string.Empty;
    public List<string> Tags { get; init; } = new();
    public List<CaseStudyMetricInput> Metrics { get; init; } = new();
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateCaseStudyCommandValidator : AbstractValidator<UpdateCaseStudyCommand>
{
    public UpdateCaseStudyCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Client).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Industry).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Summary).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Growth).NotEmpty().MaximumLength(40);
        RuleForEach(x => x.Metrics).ChildRules(m =>
        {
            m.RuleFor(x => x.Label).NotEmpty().MaximumLength(120);
            m.RuleFor(x => x.Before).NotEmpty().MaximumLength(60);
            m.RuleFor(x => x.After).NotEmpty().MaximumLength(60);
        });
    }
}

public class UpdateCaseStudyCommandHandler : IRequestHandler<UpdateCaseStudyCommand, CaseStudyDto>
{
    private readonly IAppDbContext _db;

    public UpdateCaseStudyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<CaseStudyDto> Handle(UpdateCaseStudyCommand request, CancellationToken ct)
    {
        var entity = await _db.CaseStudies
            .Include(c => c.Metrics)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Vaka çalışması", request.Id);

        entity.Client = request.Client.Trim();
        entity.Industry = request.Industry.Trim();
        entity.Summary = request.Summary.Trim();
        entity.Growth = request.Growth.Trim();
        entity.Tags = request.Tags;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;

        // Metrikleri tamamen yenile
        _db.CaseStudyMetrics.RemoveRange(entity.Metrics);
        entity.Metrics = request.Metrics.Select((m, i) => new CaseStudyMetric
        {
            CaseStudyId = entity.Id,
            Label = m.Label.Trim(),
            Before = m.Before.Trim(),
            After = m.After.Trim(),
            DisplayOrder = i,
        }).ToList();

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
