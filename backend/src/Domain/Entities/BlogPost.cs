using HasanHabibSeyda.Domain.Common;

namespace HasanHabibSeyda.Domain.Entities;

/// <summary>
/// Blog yazisi. Ziyaretci tarafi statik export ile build-time uretilir;
/// yalnizca <see cref="BlogStatuses.Published"/> + gecmis <see cref="PublishedAt"/> olanlar yayinlanir.
/// Icerik Markdown olarak saklanir; render sirasinda sanitize edilerek HTML'e cevrilir.
/// </summary>
public class BlogPost : BaseEntity
{
    // --- Temel icerik ---
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    /// <summary>Markdown govde.</summary>
    public string Content { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string CoverImageAlt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string Author { get; set; } = string.Empty;
    /// <summary>Icerikten hesaplanan tahmini okuma suresi (dakika).</summary>
    public int ReadingMinutes { get; set; }

    // --- Durum ve yasam dongusu ---
    /// <summary>draft | published | archived (bkz. <see cref="BlogStatuses"/>).</summary>
    public string Status { get; set; } = BlogStatuses.Draft;
    /// <summary>Yayin tarihi. Ileri tarihli olabilir (zamanlanmis yayin); build bu tarihi gecmis yazilari yayinlar.</summary>
    public DateTime? PublishedAt { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

    // --- SEO ---
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public string CanonicalUrl { get; set; } = string.Empty;
    public string OgTitle { get; set; } = string.Empty;
    public string OgDescription { get; set; } = string.Empty;
    public string OgImageUrl { get; set; } = string.Empty;
    /// <summary>true ise sayfa noindex — sitemap ve yapilandirilmis veriden de haric tutulur.</summary>
    public bool NoIndex { get; set; }

    // --- Slug gecmisi (301 yonlendirme icin) ---
    /// <summary>Yayindayken degistirilen eski slug'lar; kirik linkleri onlemek icin 301 kaynagi.</summary>
    public List<string> PreviousSlugs { get; set; } = new();
}

/// <summary>Blog durum sabitleri (frontend ile birebir, kucuk harf).</summary>
public static class BlogStatuses
{
    public const string Draft = "draft";
    public const string Published = "published";
    public const string Archived = "archived";

    public static readonly string[] All = { Draft, Published, Archived };

    public static bool IsValid(string? value) =>
        value is not null && Array.Exists(All, s => s == value);
}
