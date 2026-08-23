using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Contact.Commands;

public record MarkContactRequestReadCommand(Guid Id) : IRequest<ContactRequestDto>;

public class MarkContactRequestReadCommandHandler
    : IRequestHandler<MarkContactRequestReadCommand, ContactRequestDto>
{
    private readonly IAppDbContext _db;

    public MarkContactRequestReadCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ContactRequestDto> Handle(MarkContactRequestReadCommand request, CancellationToken ct)
    {
        var entity = await _db.ContactRequests.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("İletişim talebi", request.Id);

        entity.IsRead = true;
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
