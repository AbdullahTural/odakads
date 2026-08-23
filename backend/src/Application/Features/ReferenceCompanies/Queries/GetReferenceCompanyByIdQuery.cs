using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Queries;

public record GetReferenceCompanyByIdQuery(Guid Id) : IRequest<ReferenceCompanyDto>;

public class GetReferenceCompanyByIdQueryHandler : IRequestHandler<GetReferenceCompanyByIdQuery, ReferenceCompanyDto>
{
    private readonly IAppDbContext _db;

    public GetReferenceCompanyByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ReferenceCompanyDto> Handle(GetReferenceCompanyByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.ReferenceCompanies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans firma", request.Id);
        return entity.ToDto();
    }
}
