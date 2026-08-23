using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Contact.Queries;

public record GetContactRequestByIdQuery(Guid Id) : IRequest<ContactRequestDto>;

public class GetContactRequestByIdQueryHandler : IRequestHandler<GetContactRequestByIdQuery, ContactRequestDto>
{
    private readonly IAppDbContext _db;

    public GetContactRequestByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ContactRequestDto> Handle(GetContactRequestByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.ContactRequests.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("İletişim talebi", request.Id);
        return entity.ToDto();
    }
}
