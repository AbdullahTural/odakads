using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;

namespace HasanHabibSeyda.Application.Common.Mapping;

/// <summary>Entity -> DTO eslemeleri (frontend sozlesmesine gore).</summary>
public static class MappingExtensions
{
    public static ServiceDto ToDto(this Service e) => new()
    {
        Id = e.Id,
        Slug = e.Slug,
        Title = e.Title,
        Description = e.Description,
        Icon = e.Icon,
        Features = e.Features,
        Order = e.DisplayOrder,
        IsActive = e.IsActive,
    };

    public static StatDto ToDto(this Stat e) => new()
    {
        Id = e.Id,
        Label = e.Label,
        Value = e.Value,
        Suffix = e.Suffix,
        Prefix = e.Prefix,
        Icon = e.Icon,
    };

    public static ProcessStepDto ToDto(this ProcessStep e) => new()
    {
        Id = e.Id,
        Step = e.Step,
        Title = e.Title,
        Description = e.Description,
        Icon = e.Icon,
    };

    public static ValueDto ToDto(this CompanyValue e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Description = e.Description,
        Icon = e.Icon,
    };

    public static TestimonialDto ToDto(this Testimonial e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Role = e.Role,
        Company = e.Company,
        AvatarUrl = e.AvatarUrl,
        Rating = e.Rating,
        Content = e.Content,
        IsFeatured = e.IsFeatured,
        IsActive = e.IsActive,
    };

    public static ReviewDto ToDto(this Review e) => new()
    {
        Id = e.Id,
        Author = e.Author,
        Service = e.Service,
        Rating = e.Rating,
        Comment = e.Comment,
        Date = e.Date.ToString("yyyy-MM-dd"),
        Source = e.Source,
        CompanyLogoUrl = e.CompanyLogoUrl,
        IsActive = e.IsActive,
    };

    public static ReferenceCompanyDto ToDto(this ReferenceCompany e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        LogoUrl = e.LogoUrl,
        DisplayOrder = e.DisplayOrder,
        IsActive = e.IsActive,
    };

    public static VideoTestimonialDto ToDto(this VideoTestimonial e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Company = e.Company,
        ThumbnailUrl = e.ThumbnailUrl,
        VideoUrl = e.VideoUrl,
        Duration = e.Duration,
        Quote = e.Quote,
        DisplayOrder = e.DisplayOrder,
        IsActive = e.IsActive,
    };

    public static CaseStudyDto ToDto(this CaseStudy e) => new()
    {
        Id = e.Id,
        Client = e.Client,
        Industry = e.Industry,
        Summary = e.Summary,
        Growth = e.Growth,
        Tags = e.Tags,
        DisplayOrder = e.DisplayOrder,
        IsActive = e.IsActive,
        Metrics = e.Metrics
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new CaseStudyMetricDto
            {
                Label = m.Label,
                Before = m.Before,
                After = m.After,
            })
            .ToList(),
    };

    public static SiteSettingsDto ToDto(this SiteSettings e) => new()
    {
        Id = e.Id,
        Phone = e.Phone,
        Email = e.Email,
        Address = e.Address,
        GoogleMapEmbed = e.GoogleMapEmbed,
        FacebookUrl = e.FacebookUrl,
        InstagramUrl = e.InstagramUrl,
        LinkedinUrl = e.LinkedinUrl,
    };

    public static ContactRequestDto ToDto(this ContactRequest e) => new()
    {
        Id = e.Id,
        FullName = e.FullName,
        Phone = e.Phone,
        Email = e.Email,
        Company = e.Company,
        ServiceType = e.ServiceType,
        Message = e.Message,
        CreatedDate = e.CreatedDate,
        IsRead = e.IsRead,
    };

    public static AdminUserDto ToDto(this AdminUser e) => new()
    {
        Id = e.Id,
        FullName = e.FullName,
        Email = e.Email,
        Role = e.Role,
    };

    // --- Phase 3 ---

    public static SeoSettingDto ToDto(this SeoSetting e) => new()
    {
        Id = e.Id,
        PageKey = e.PageKey,
        PageName = e.PageName,
        Title = e.Title,
        Description = e.Description,
        Keywords = e.Keywords,
        CanonicalUrl = e.CanonicalUrl,
        IsActive = e.IsActive,
        UpdatedDate = e.UpdatedDate,
    };

    public static AnalyticsSettingDto ToDto(this AnalyticsSetting e) => new()
    {
        Id = e.Id,
        GoogleAnalyticsMeasurementId = e.GoogleAnalyticsMeasurementId,
        GoogleTagManagerId = e.GoogleTagManagerId,
        GoogleSearchConsoleVerificationCode = e.GoogleSearchConsoleVerificationCode,
        MicrosoftClarityProjectId = e.MicrosoftClarityProjectId,
        MetaPixelId = e.MetaPixelId,
        LinkedinInsightTagPartnerId = e.LinkedinInsightTagPartnerId,
        IsActive = e.IsActive,
    };

    public static ConversionSettingDto ToDto(this ConversionSetting e) => new()
    {
        Id = e.Id,
        WhatsappPhoneNumber = e.WhatsappPhoneNumber,
        WhatsappDefaultMessage = e.WhatsappDefaultMessage,
        IsWhatsappEnabled = e.IsWhatsappEnabled,
        IsClickToCallEnabled = e.IsClickToCallEnabled,
        CalendlyUrl = e.CalendlyUrl,
        IsCalendlyEnabled = e.IsCalendlyEnabled,
        PrimaryCtaText = e.PrimaryCtaText,
        PrimaryCtaUrl = e.PrimaryCtaUrl,
        SecondaryCtaText = e.SecondaryCtaText,
        SecondaryCtaUrl = e.SecondaryCtaUrl,
    };

    public static AboutSettingDto ToDto(this AboutSetting e) => new()
    {
        Id = e.Id,
        FounderName = e.FounderName,
        FounderTitle = e.FounderTitle,
        FounderDescription = e.FounderDescription,
        CompanyStory = e.CompanyStory,
        MissionText = e.MissionText,
        VisionText = e.VisionText,
    };
}
