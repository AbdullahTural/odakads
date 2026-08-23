namespace HasanHabibSeyda.Domain.Common;

/// <summary>Tum entity'ler icin ortak temel — Guid Id (JSON'da string olarak doner).</summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
}
