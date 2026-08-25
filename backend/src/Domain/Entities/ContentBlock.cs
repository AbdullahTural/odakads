using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>
/// Anahtar-deger site icerik blogu — admin'den duzenlenebilen metinler (hero, CTA, footer, sayfa basliklari).
/// Deger DUZ METIN'dir (HTML degil); frontend React ile kacislanarak render eder → XSS riski yok.
/// Yeni duzenlenebilir metin eklemek migration gerektirmez (yalnizca yeni bir anahtar).
/// </summary>
public class ContentBlock : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
