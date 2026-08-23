using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Testimonials.Queries;

public record GetTestimonialByIdQuery(Guid Id) : IRequest<TestimonialDto>;

public class GetTestimonialByIdQueryHandler : IRequestHandler<GetTestimonialByIdQuery, TestimonialDto>
{
    private readonly IAppDbContext _db;

    public GetTestimonialByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<TestimonialDto> Handle(GetTestimonialByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.Testimonials.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans", request.Id);
        return entity.ToDto();
    }
}
