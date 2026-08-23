using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Services.Commands;

public record DeleteServiceCommand(Guid Id) : IRequest<bool>;

public class DeleteServiceCommandHandler : IRequestHandler<DeleteServiceCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteServiceCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteServiceCommand request, CancellationToken ct)
    {
        var entity = await _db.Services.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Hizmet", request.Id);

        _db.Services.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
