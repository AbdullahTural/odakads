using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Commands;

public record DeleteReferenceCompanyCommand(Guid Id) : IRequest<bool>;

public class DeleteReferenceCompanyCommandHandler : IRequestHandler<DeleteReferenceCompanyCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteReferenceCompanyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteReferenceCompanyCommand request, CancellationToken ct)
    {
        var entity = await _db.ReferenceCompanies.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans firma", request.Id);

        _db.ReferenceCompanies.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
