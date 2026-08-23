namespace HasanHabibSeyda.Infrastructure.Settings;

public class DatabaseSettings
{
    public const string SectionName = "Database";

    /// <summary>Acilista EF migration uygula (varsayilan: true).</summary>
    public bool AutoMigrate { get; set; } = true;

    /// <summary>Bos tablolara seed verisi ekle (idempotent; varsayilan: true).</summary>
    public bool SeedOnStartup { get; set; } = true;
}
