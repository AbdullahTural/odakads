using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Testimonials.Queries;

public record GetTestimonialsQuery : IRequest<List<TestimonialDto>>;

public class GetTestimonialsQueryHandler : IRequestHandler<GetTestimonialsQuery, List<TestimonialDto>>
{
    private readonly IAppDbContext _db;

    public GetTestimonialsQueryHandler(IAppDbContext db) => _db = db;

    public Task<List<TestimonialDto>> Handle(GetTestimonialsQuery request, CancellationToken ct) =>
        _db.Testimonials
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.IsFeatured)
            .ThenByDescending(s => s.CreatedDate)
            .Select(s => new TestimonialDto
            {
                Id = s.Id,
                Name = s.Name,
                Role = s.Role,
                Company = s.Company,
                AvatarUrl = s.AvatarUrl,
                Rating = s.Rating,
                Content = s.Content,
                IsFeatured = s.IsFeatured,
                IsActive = s.IsActive,
            })
            .ToListAsync(ct);
}
