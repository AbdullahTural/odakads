using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Queries;

public record GetVideoTestimonialsQuery : IRequest<List<VideoTestimonialDto>>;

public class GetVideoTestimonialsQueryHandler
    : IRequestHandler<GetVideoTestimonialsQuery, List<VideoTestimonialDto>>
{
    private readonly IAppDbContext _db;

    public GetVideoTestimonialsQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<VideoTestimonialDto>> Handle(GetVideoTestimonialsQuery request, CancellationToken ct) =>
        _db.VideoTestimonials
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new VideoTestimonialDto
            {
                Id = s.Id,
                Name = s.Name,
                Company = s.Company,
                ThumbnailUrl = s.ThumbnailUrl,
                VideoUrl = s.VideoUrl,
                Duration = s.Duration,
                Quote = s.Quote,
                DisplayOrder = s.DisplayOrder,
                IsActive = s.IsActive,
            })
            .ToListAsync(ct);
}
