using HasanHabibSeyda.Domain.Entities;

namespace HasanHabibSeyda.Application.Common.Interfaces;

public record TokenResult(string AccessToken, DateTime ExpiresAt);

public record RefreshTokenResult(string Token, DateTime ExpiresAt);

public interface IJwtService
{
    TokenResult GenerateAccessToken(AdminUser user);
    RefreshTokenResult GenerateRefreshToken();
}
