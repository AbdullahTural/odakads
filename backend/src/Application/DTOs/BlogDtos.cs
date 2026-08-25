namespace HasanHabibSeyda.Application.DTOs;

/// <summary>Blog liste ogesi (public /api/blogs + admin liste). Icerik icermez.</summary>
public class BlogListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string CoverImageAlt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string Author { get; set; } = string.Empty;
    public int ReadingMinutes { get; set; }
    /// <summary>ISO 8601. Public listede yalnizca yayindakiler doldurulur.</summary>
    public string? PublishedAt { get; set; }
}

/// <summary>Blog detay (public /api/blogs/{slug}). Markdown icerik + SEO alanlari.</summary>
public class BlogDetailDto : BlogListItemDto
{
    /// <summary>Markdown govde.</summary>
    public string Content { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;

    // SEO
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public string CanonicalUrl { get; set; } = string.Empty;
    public string OgTitle { get; set; } = string.Empty;
    public string OgDescription { get; set; } = string.Empty;
    public string OgImageUrl { get; set; } = string.Empty;
    public bool NoIndex { get; set; }
}

/// <summary>Admin liste ogesi — tum durumlar (taslak/yayinda/arsiv).</summary>
public class BlogAdminListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string? PublishedAt { get; set; }
    public DateTime UpdatedDate { get; set; }
}

/// <summary>Admin tam detay — editor + onizleme icin (durumdan bagimsiz).</summary>
public class BlogAdminDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string CoverImageAlt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string Author { get; set; } = string.Empty;
    public int ReadingMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? PublishedAt { get; set; }
    public string? ArchivedAt { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public string CanonicalUrl { get; set; } = string.Empty;
    public string OgTitle { get; set; } = string.Empty;
    public string OgDescription { get; set; } = string.Empty;
    public string OgImageUrl { get; set; } = string.Empty;
    public bool NoIndex { get; set; }
    public List<string> PreviousSlugs { get; set; } = new();
}

/// <summary>Slug musaitlik kontrolu cevabi.</summary>
public record BlogSlugCheckDto(string Slug, bool Available);
