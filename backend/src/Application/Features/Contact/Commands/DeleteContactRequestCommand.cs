using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Contact.Commands;

public record DeleteContactRequestCommand(Guid Id) : IRequest<bool>;

public class DeleteContactRequestCommandHandler : IRequestHandler<DeleteContactRequestCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteContactRequestCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteContactRequestCommand request, CancellationToken ct)
    {
        var entity = await _db.ContactRequests.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("İletişim talebi", request.Id);

        _db.ContactRequests.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
