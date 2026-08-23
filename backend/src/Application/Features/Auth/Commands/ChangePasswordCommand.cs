using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HasanHabibSeyda.Application.Features.Auth.Commands;

public record ChangePasswordCommand : IRequest<bool>
{
    public string CurrentPassword { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
    public string ConfirmPassword { get; init; } = string.Empty;
}

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Mevcut parola zorunludur.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Yeni parola zorunludur.")
            .MinimumLength(8).WithMessage("Yeni parola en az 8 karakter olmalıdır.")
            .MaximumLength(128).WithMessage("Yeni parola en fazla 128 karakter olabilir.")
            .Matches("[A-Z]").WithMessage("Yeni parola en az bir büyük harf içermelidir.")
            .Matches("[a-z]").WithMessage("Yeni parola en az bir küçük harf içermelidir.")
            .Matches("[0-9]").WithMessage("Yeni parola en az bir rakam içermelidir.")
            .Matches(@"[^a-zA-Z0-9]").WithMessage("Yeni parola en az bir özel karakter içermelidir.")
            .NotEqual(x => x.CurrentPassword).WithMessage("Yeni parola mevcut paroladan farklı olmalıdır.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.NewPassword).WithMessage("Parola tekrarı eşleşmiyor.");
    }
}

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IAppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<ChangePasswordCommandHandler> _logger;

    public ChangePasswordCommandHandler(
        IAppDbContext db,
        IPasswordHasher hasher,
        ICurrentUser currentUser,
        ILogger<ChangePasswordCommandHandler> logger)
    {
        _db = db;
        _hasher = hasher;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        if (_currentUser.UserId is null)
            throw new AppUnauthorizedException("Oturum bilgisi bulunamadı.");

        var user = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId && u.IsActive, ct);

        if (user is null)
            throw new AppUnauthorizedException("Kullanıcı bulunamadı.");

        if (!_hasher.VerifyPassword(request.CurrentPassword, user.PasswordHash, user.PasswordSalt))
            throw new AppUnauthorizedException("Mevcut parola hatalı.");

        var (hash, salt) = _hasher.HashPassword(request.NewPassword);
        user.PasswordHash = hash;
        user.PasswordSalt = salt;

        await _db.SaveChangesAsync(ct);

        _logger.LogInformation(
            "Admin parola guncellendi: {Email}, IP: {Ip}",
            user.Email,
            _currentUser.IpAddress);

        return true;
    }
}
