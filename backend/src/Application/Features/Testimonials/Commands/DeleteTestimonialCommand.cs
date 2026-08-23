using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Testimonials.Commands;

public record DeleteTestimonialCommand(Guid Id) : IRequest<bool>;

public class DeleteTestimonialCommandHandler : IRequestHandler<DeleteTestimonialCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteTestimonialCommand request, CancellationToken ct)
    {
        var entity = await _db.Testimonials.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans", request.Id);

        _db.Testimonials.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
