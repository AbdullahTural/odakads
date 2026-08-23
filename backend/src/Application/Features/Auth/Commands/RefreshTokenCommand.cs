using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Auth.Commands;

public record RefreshTokenCommand : IRequest<AuthResponseDto>
{
    public string RefreshToken { get; init; } = string.Empty;
}

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("Refresh token zorunludur.");
    }
}

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    private readonly IAppDbContext _db;
    private readonly IJwtService _jwt;

    public RefreshTokenCommandHandler(IAppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var existing = await _db.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, ct);

        if (existing is null || !existing.IsActive || existing.User is null || !existing.User.IsActive)
            throw new AppUnauthorizedException("Geçersiz veya süresi dolmuş oturum.");

        // Rotation: eski token'i iptal et, yenisini uret.
        existing.RevokedAt = DateTime.UtcNow;

        var access = _jwt.GenerateAccessToken(existing.User);
        var refresh = _jwt.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = existing.UserId,
            Token = refresh.Token,
            ExpiresAt = refresh.ExpiresAt,
        });
        await _db.SaveChangesAsync(ct);

        return new AuthResponseDto
        {
            AccessToken = access.AccessToken,
            RefreshToken = refresh.Token,
            ExpiresAt = access.ExpiresAt,
            User = existing.User.ToDto(),
        };
    }
}
