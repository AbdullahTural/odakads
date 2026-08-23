using System.Security.Claims;
using HasanHabibSeyda.Application.Common.Interfaces;

namespace HasanHabibSeyda.API.Services;

/// <summary>HttpContext + JWT claim'lerinden aktif kullanici/istemci bilgisi.</summary>
public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _accessor;

    public CurrentUser(IHttpContextAccessor accessor) => _accessor = accessor;

    private HttpContext? Ctx => _accessor.HttpContext;

    public Guid? UserId
    {
        get
        {
            var raw = Ctx?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? Ctx?.User?.FindFirstValue("sub");
            return Guid.TryParse(raw, out var id) ? id : null;
        }
    }

    public string? Email =>
        Ctx?.User?.FindFirstValue(ClaimTypes.Email)
        ?? Ctx?.User?.FindFirstValue("email");

    public string? IpAddress =>
        Ctx?.Connection?.RemoteIpAddress?.ToString();

    public string? UserAgent
    {
        get
        {
            var ua = Ctx?.Request?.Headers["User-Agent"].ToString();
            return string.IsNullOrWhiteSpace(ua) ? null : ua;
        }
    }
}
