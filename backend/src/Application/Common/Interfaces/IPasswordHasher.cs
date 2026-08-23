namespace HasanHabibSeyda.Application.Common.Interfaces;

public interface IPasswordHasher
{
    /// <summary>Yeni parola icin hash + salt uretir.</summary>
    (string Hash, string Salt) HashPassword(string password);

    /// <summary>Verilen parolayi kayitli hash/salt ile dogrular.</summary>
    bool VerifyPassword(string password, string hash, string salt);
}
