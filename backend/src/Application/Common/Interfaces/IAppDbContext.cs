using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Common.Interfaces;

/// <summary>
/// DbContext soyutlamasi (Repository/UoW yok — DbContext zaten UoW saglar).
/// Application katmani veriye bu arayuz uzerinden erisir.
/// </summary>
public interface IAppDbContext
{
    DbSet<Service> Services { get; }
    DbSet<Stat> Stats { get; }
    DbSet<ProcessStep> ProcessSteps { get; }
    DbSet<CompanyValue> CompanyValues { get; }
    DbSet<Testimonial> Testimonials { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ReferenceCompany> ReferenceCompanies { get; }
    DbSet<VideoTestimonial> VideoTestimonials { get; }
    DbSet<CaseStudy> CaseStudies { get; }
    DbSet<CaseStudyMetric> CaseStudyMetrics { get; }
    DbSet<ContactRequest> ContactRequests { get; }
    DbSet<SiteSettings> SiteSettings { get; }
    DbSet<AdminUser> AdminUsers { get; }
    DbSet<RefreshToken> RefreshTokens { get; }

    // Phase 3
    DbSet<SeoSetting> SeoSettings { get; }
    DbSet<AnalyticsSetting> AnalyticsSettings { get; }
    DbSet<ConversionSetting> ConversionSettings { get; }
    DbSet<AboutSetting> AboutSettings { get; }

    // Blog
    DbSet<BlogPost> BlogPosts { get; }

    // Site icerigi (anahtar-deger)
    DbSet<ContentBlock> ContentBlocks { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
