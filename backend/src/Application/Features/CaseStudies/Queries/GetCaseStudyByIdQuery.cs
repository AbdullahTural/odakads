using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Queries;

public record GetCaseStudyByIdQuery(Guid Id) : IRequest<CaseStudyDto>;

public class GetCaseStudyByIdQueryHandler : IRequestHandler<GetCaseStudyByIdQuery, CaseStudyDto>
{
    private readonly IAppDbContext _db;

    public GetCaseStudyByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<CaseStudyDto> Handle(GetCaseStudyByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.CaseStudies.AsNoTracking()
            .Include(c => c.Metrics)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Vaka çalışması", request.Id);
        return entity.ToDto();
    }
}
