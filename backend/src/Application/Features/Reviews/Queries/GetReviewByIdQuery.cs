using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Reviews.Queries;

public record GetReviewByIdQuery(Guid Id) : IRequest<ReviewDto>;

public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    private readonly IAppDbContext _db;

    public GetReviewByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ReviewDto> Handle(GetReviewByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.Reviews.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Armut yorumu", request.Id);
        return entity.ToDto();
    }
}
