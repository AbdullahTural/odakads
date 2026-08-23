using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Reviews.Queries;

public record GetReviewsQuery : IRequest<List<ReviewDto>>;

public class GetReviewsQueryHandler : IRequestHandler<GetReviewsQuery, List<ReviewDto>>
{
    private readonly IAppDbContext _db;

    public GetReviewsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<ReviewDto>> Handle(GetReviewsQuery request, CancellationToken ct)
    {
        var items = await _db.Reviews
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.Date)
            .ToListAsync(ct);

        return items.Select(s => s.ToDto()).ToList();
    }
}
