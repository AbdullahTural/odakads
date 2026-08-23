using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Queries;

public record GetVideoTestimonialByIdQuery(Guid Id) : IRequest<VideoTestimonialDto>;

public class GetVideoTestimonialByIdQueryHandler
    : IRequestHandler<GetVideoTestimonialByIdQuery, VideoTestimonialDto>
{
    private readonly IAppDbContext _db;

    public GetVideoTestimonialByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<VideoTestimonialDto> Handle(GetVideoTestimonialByIdQuery request, CancellationToken ct)
    {
        var entity = await _db.VideoTestimonials.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Video referans", request.Id);
        return entity.ToDto();
    }
}
