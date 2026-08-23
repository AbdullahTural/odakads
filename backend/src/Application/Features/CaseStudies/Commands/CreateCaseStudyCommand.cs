using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Commands;

public record CreateCaseStudyCommand : IRequest<CaseStudyDto>
{
    public string Client { get; init; } = string.Empty;
    public string Industry { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Growth { get; init; } = string.Empty;
    public List<string> Tags { get; init; } = new();
    public List<CaseStudyMetricInput> Metrics { get; init; } = new();
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateCaseStudyCommandValidator : AbstractValidator<CreateCaseStudyCommand>
{
    public CreateCaseStudyCommandValidator()
    {
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

public class CreateCaseStudyCommandHandler : IRequestHandler<CreateCaseStudyCommand, CaseStudyDto>
{
    private readonly IAppDbContext _db;

    public CreateCaseStudyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<CaseStudyDto> Handle(CreateCaseStudyCommand request, CancellationToken ct)
    {
        var entity = new CaseStudy
        {
            Client = request.Client.Trim(),
            Industry = request.Industry.Trim(),
            Summary = request.Summary.Trim(),
            Growth = request.Growth.Trim(),
            Tags = request.Tags,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            Metrics = request.Metrics.Select((m, i) => new CaseStudyMetric
            {
                Label = m.Label.Trim(),
                Before = m.Before.Trim(),
                After = m.After.Trim(),
                DisplayOrder = i,
            }).ToList(),
        };

        _db.CaseStudies.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
