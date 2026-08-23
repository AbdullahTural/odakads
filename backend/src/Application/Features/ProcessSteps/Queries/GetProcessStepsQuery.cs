using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ProcessSteps.Queries;

public record GetProcessStepsQuery : IRequest<List<ProcessStepDto>>;

public class GetProcessStepsQueryHandler : IRequestHandler<GetProcessStepsQuery, List<ProcessStepDto>>
{
    private readonly IAppDbContext _db;

    public GetProcessStepsQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<ProcessStepDto>> Handle(GetProcessStepsQuery request, CancellationToken ct) =>
        _db.ProcessSteps
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.Step)
            .Select(s => new ProcessStepDto
            {
                Id = s.Id,
                Step = s.Step,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
            })
            .ToListAsync(ct);
}
