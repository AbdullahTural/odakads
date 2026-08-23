namespace HasanHabibSeyda.Application.Common.Exceptions;

/// <summary>Kayit bulunamadiginda (404).</summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }

    public NotFoundException(string entity, object key)
        : base($"{entity} ({key}) bulunamadı.") { }
}

/// <summary>Yetkilendirme / kimlik dogrulama hatasi (401).</summary>
public class AppUnauthorizedException : Exception
{
    public AppUnauthorizedException(string message) : base(message) { }
}

/// <summary>FluentValidation hatalarini tasiyan istisna (422).</summary>
public class AppValidationException : Exception
{
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public AppValidationException(IReadOnlyDictionary<string, string[]> errors)
        : base("Bir veya daha fazla doğrulama hatası oluştu.")
    {
        Errors = errors;
    }
}
