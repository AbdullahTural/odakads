namespace HasanHabibSeyda.Application.Common.Interfaces;

/// <summary>Aktif istegin kullanici + istemci bilgileri (log'lar icin).</summary>
public interface ICurrentUser
{
    Guid? UserId { get; }
    string? Email { get; }
    string? IpAddress { get; }
    string? UserAgent { get; }
}
