using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.VideoTestimonials.Commands;

public record DeleteVideoTestimonialCommand(Guid Id) : IRequest<bool>;

public class DeleteVideoTestimonialCommandHandler : IRequestHandler<DeleteVideoTestimonialCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteVideoTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteVideoTestimonialCommand request, CancellationToken ct)
    {
        var entity = await _db.VideoTestimonials.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Video referans", request.Id);

        _db.VideoTestimonials.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
