using System.Reflection;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Service> Services => Set<Service>();
    public DbSet<Stat> Stats => Set<Stat>();
    public DbSet<ProcessStep> ProcessSteps => Set<ProcessStep>();
    public DbSet<CompanyValue> CompanyValues => Set<CompanyValue>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReferenceCompany> ReferenceCompanies => Set<ReferenceCompany>();
    public DbSet<VideoTestimonial> VideoTestimonials => Set<VideoTestimonial>();
    public DbSet<CaseStudy> CaseStudies => Set<CaseStudy>();
    public DbSet<CaseStudyMetric> CaseStudyMetrics => Set<CaseStudyMetric>();
    public DbSet<ContactRequest> ContactRequests => Set<ContactRequest>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // Phase 3
    public DbSet<SeoSetting> SeoSettings => Set<SeoSetting>();
    public DbSet<AnalyticsSetting> AnalyticsSettings => Set<AnalyticsSetting>();
    public DbSet<ConversionSetting> ConversionSettings => Set<ConversionSetting>();
    public DbSet<AboutSetting> AboutSettings => Set<AboutSetting>();

    // Blog
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
