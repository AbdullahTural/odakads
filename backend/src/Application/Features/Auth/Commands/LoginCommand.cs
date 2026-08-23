using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HasanHabibSeyda.Application.Features.Auth.Commands;

public record LoginCommand : IRequest<AuthResponseDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta girin.");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Parola zorunludur.");
    }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IAppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtService _jwt;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IAppDbContext db,
        IPasswordHasher hasher,
        IJwtService jwt,
        ICurrentUser currentUser,
        ILogger<LoginCommandHandler> logger)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwt;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.IsActive, ct);

        if (user is null || !_hasher.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            _logger.LogWarning(
                "Basarisiz admin giris denemesi: {Email}, IP: {Ip}",
                MaskEmail(email),
                _currentUser.IpAddress);
            throw new AppUnauthorizedException("E-posta veya parola hatalı.");
        }

        var access = _jwt.GenerateAccessToken(user);
        var refresh = _jwt.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refresh.Token,
            ExpiresAt = refresh.ExpiresAt,
        });

        await _db.SaveChangesAsync(ct);

        _logger.LogInformation(
            "Admin giris basarili: {Email}, IP: {Ip}",
            MaskEmail(user.Email),
            _currentUser.IpAddress);

        return new AuthResponseDto
        {
            AccessToken = access.AccessToken,
            RefreshToken = refresh.Token,
            ExpiresAt = access.ExpiresAt,
            User = user.ToDto(),
        };
    }

    private static string MaskEmail(string email)
    {
        var at = email.IndexOf('@');
        if (at <= 1) return "***";
        return $"{email[0]}***{email[at..]}";
    }
}
