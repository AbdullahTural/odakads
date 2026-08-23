namespace HasanHabibSeyda.Application.DTOs;

// Bu DTO'lar frontend lib/api/types.ts ile BIREBIR ayni JSON'a serilesir.
// System.Text.Json camelCase kullandigi icin property adlari otomatik olarak
// id, slug, title, order ... seklinde doner.

public class ServiceDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public List<string> Features { get; set; } = new();
    public int Order { get; set; } // entity.DisplayOrder
    // Admin alani (public TS sozlesmesini bozmaz; public site bu alani yok sayar)
    public bool IsActive { get; set; }
}

public class StatDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public string? Suffix { get; set; }
    public string? Prefix { get; set; }
    public string Icon { get; set; } = string.Empty;
}

public class ProcessStepDto
{
    public Guid Id { get; set; }
    public int Step { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class ValueDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    // Admin alanlari
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
}

public class ReviewDto
{
    public Guid Id { get; set; }
    public string Author { get; set; } = string.Empty;
    public string Service { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty; // ISO yyyy-MM-dd
    public string Source { get; set; } = string.Empty;
    public string? CompanyLogoUrl { get; set; }
    // Admin alani (public site bu alani yok sayar)
    public bool IsActive { get; set; }
}

public class VideoTestimonialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    // Admin alanlari
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CaseStudyMetricDto
{
    public string Label { get; set; } = string.Empty;
    public string Before { get; set; } = string.Empty;
    public string After { get; set; } = string.Empty;
}

public class CaseStudyDto
{
    public Guid Id { get; set; }
    public string Client { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<CaseStudyMetricDto> Metrics { get; set; } = new();
    public string Growth { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    // Admin alanlari
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class ReferenceCompanyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class SiteSettingsDto
{
    public Guid Id { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string GoogleMapEmbed { get; set; } = string.Empty;
    public string FacebookUrl { get; set; } = string.Empty;
    public string InstagramUrl { get; set; } = string.Empty;
    public string LinkedinUrl { get; set; } = string.Empty;
}
