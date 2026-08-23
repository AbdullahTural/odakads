using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Reviews.Commands;

public record DeleteReviewCommand(Guid Id) : IRequest<bool>;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteReviewCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteReviewCommand request, CancellationToken ct)
    {
        var entity = await _db.Reviews.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Armut yorumu", request.Id);

        _db.Reviews.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
