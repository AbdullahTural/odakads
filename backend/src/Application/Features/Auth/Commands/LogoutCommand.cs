using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Auth.Commands;

public record LogoutCommand : IRequest<bool>
{
    public string RefreshToken { get; init; } = string.Empty;
}

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IAppDbContext _db;

    public LogoutCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(LogoutCommand request, CancellationToken ct)
    {
        var token = await _db.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, ct);

        if (token is not null && token.RevokedAt is null)
        {
            token.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }

        return true;
    }
}
