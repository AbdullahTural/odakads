using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.CaseStudies.Commands;

public record DeleteCaseStudyCommand(Guid Id) : IRequest<bool>;

public class DeleteCaseStudyCommandHandler : IRequestHandler<DeleteCaseStudyCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteCaseStudyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteCaseStudyCommand request, CancellationToken ct)
    {
        var entity = await _db.CaseStudies
            .Include(c => c.Metrics)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Vaka çalışması", request.Id);

        _db.CaseStudies.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
