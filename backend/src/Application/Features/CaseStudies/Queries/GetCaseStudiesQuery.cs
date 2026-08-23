using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Queries;

public record GetCaseStudiesQuery : IRequest<List<CaseStudyDto>>;

public class GetCaseStudiesQueryHandler : IRequestHandler<GetCaseStudiesQuery, List<CaseStudyDto>>
{
    private readonly IAppDbContext _db;

    public GetCaseStudiesQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<CaseStudyDto>> Handle(GetCaseStudiesQuery request, CancellationToken ct) =>
        _db.CaseStudies
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new CaseStudyDto
            {
                Id = s.Id,
                Client = s.Client,
                Industry = s.Industry,
                Summary = s.Summary,
                Growth = s.Growth,
                Tags = s.Tags,
                DisplayOrder = s.DisplayOrder,
                IsActive = s.IsActive,
                Metrics = s.Metrics
                    .OrderBy(m => m.DisplayOrder)
                    .Select(m => new CaseStudyMetricDto
                    {
                        Label = m.Label,
                        Before = m.Before,
                        After = m.After,
                    })
                    .ToList(),
            })
            .ToListAsync(ct);
}
