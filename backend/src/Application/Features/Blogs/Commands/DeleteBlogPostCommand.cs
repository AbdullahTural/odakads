using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Blogs.Commands;

/// <summary>
/// Kalici silme. Onerilen akis arsivlemedir (durum=archived);
/// bu komut yalnizca kalici kaldirma icin (or. hatali taslak) kullanilmalidir.
/// </summary>
public record DeleteBlogPostCommand(Guid Id) : IRequest<bool>;

public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand, bool>
{
    private readonly IAppDbContext _db;

    public DeleteBlogPostCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(DeleteBlogPostCommand request, CancellationToken ct)
    {
        var entity = await _db.BlogPosts
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Blog yazısı", request.Id);

        _db.BlogPosts.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
