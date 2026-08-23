using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HasanHabibSeyda.Persistence.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> b)
    {
        b.Property(x => x.Slug).HasMaxLength(160).IsRequired();
        b.HasIndex(x => x.Slug).IsUnique();
        b.Property(x => x.Title).HasMaxLength(160).IsRequired();
        b.Property(x => x.Description).HasMaxLength(1000).IsRequired();
        b.Property(x => x.Icon).HasMaxLength(60).IsRequired();
        b.Property(x => x.Features)
            .HasConversion(StringListConverter.Converter)
            .Metadata.SetValueComparer(StringListConverter.Comparer);
    }
}

public class StatConfiguration : IEntityTypeConfiguration<Stat>
{
    public void Configure(EntityTypeBuilder<Stat> b)
    {
        b.Property(x => x.Label).HasMaxLength(120).IsRequired();
        b.Property(x => x.Icon).HasMaxLength(60).IsRequired();
        b.Property(x => x.Suffix).HasMaxLength(20);
        b.Property(x => x.Prefix).HasMaxLength(20);
    }
}

public class ProcessStepConfiguration : IEntityTypeConfiguration<ProcessStep>
{
    public void Configure(EntityTypeBuilder<ProcessStep> b)
    {
        b.Property(x => x.Title).HasMaxLength(160).IsRequired();
        b.Property(x => x.Description).HasMaxLength(1000).IsRequired();
        b.Property(x => x.Icon).HasMaxLength(60).IsRequired();
    }
}

public class CompanyValueConfiguration : IEntityTypeConfiguration<CompanyValue>
{
    public void Configure(EntityTypeBuilder<CompanyValue> b)
    {
        b.Property(x => x.Title).HasMaxLength(160).IsRequired();
        b.Property(x => x.Description).HasMaxLength(1000).IsRequired();
        b.Property(x => x.Icon).HasMaxLength(60).IsRequired();
    }
}

public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> b)
    {
        b.Property(x => x.Name).HasMaxLength(120).IsRequired();
        b.Property(x => x.Role).HasMaxLength(120).IsRequired();
        b.Property(x => x.Company).HasMaxLength(160).IsRequired();
        b.Property(x => x.Content).HasMaxLength(2000).IsRequired();
        b.Property(x => x.AvatarUrl).HasMaxLength(500);
    }
}

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> b)
    {
        b.Property(x => x.Author).HasMaxLength(120).IsRequired();
        b.Property(x => x.Service).HasMaxLength(160).IsRequired();
        b.Property(x => x.Comment).HasMaxLength(2000).IsRequired();
        b.Property(x => x.Source).HasMaxLength(60).IsRequired();
        b.Property(x => x.CompanyLogoUrl).HasMaxLength(500);
    }
}

public class ReferenceCompanyConfiguration : IEntityTypeConfiguration<ReferenceCompany>
{
    public void Configure(EntityTypeBuilder<ReferenceCompany> b)
    {
        b.Property(x => x.Name).HasMaxLength(160).IsRequired();
        b.Property(x => x.LogoUrl).HasMaxLength(500).IsRequired();
    }
}

public class VideoTestimonialConfiguration : IEntityTypeConfiguration<VideoTestimonial>
{
    public void Configure(EntityTypeBuilder<VideoTestimonial> b)
    {
        b.Property(x => x.Name).HasMaxLength(120).IsRequired();
        b.Property(x => x.Company).HasMaxLength(160).IsRequired();
        b.Property(x => x.VideoUrl).HasMaxLength(500).IsRequired();
        b.Property(x => x.ThumbnailUrl).HasMaxLength(500);
        b.Property(x => x.Duration).HasMaxLength(20).IsRequired();
        b.Property(x => x.Quote).HasMaxLength(500).IsRequired();
    }
}

public class CaseStudyConfiguration : IEntityTypeConfiguration<CaseStudy>
{
    public void Configure(EntityTypeBuilder<CaseStudy> b)
    {
        b.Property(x => x.Client).HasMaxLength(160).IsRequired();
        b.Property(x => x.Industry).HasMaxLength(160).IsRequired();
        b.Property(x => x.Summary).HasMaxLength(1000).IsRequired();
        b.Property(x => x.Growth).HasMaxLength(40).IsRequired();
        b.Property(x => x.Tags)
            .HasConversion(StringListConverter.Converter)
            .Metadata.SetValueComparer(StringListConverter.Comparer);

        b.HasMany(x => x.Metrics)
            .WithOne()
            .HasForeignKey(m => m.CaseStudyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CaseStudyMetricConfiguration : IEntityTypeConfiguration<CaseStudyMetric>
{
    public void Configure(EntityTypeBuilder<CaseStudyMetric> b)
    {
        b.Property(x => x.Label).HasMaxLength(120).IsRequired();
        b.Property(x => x.Before).HasMaxLength(60).IsRequired();
        b.Property(x => x.After).HasMaxLength(60).IsRequired();
    }
}

public class ContactRequestConfiguration : IEntityTypeConfiguration<ContactRequest>
{
    public void Configure(EntityTypeBuilder<ContactRequest> b)
    {
        b.Property(x => x.FullName).HasMaxLength(120).IsRequired();
        b.Property(x => x.Phone).HasMaxLength(40).IsRequired();
        b.Property(x => x.Email).HasMaxLength(200).IsRequired();
        b.Property(x => x.Company).HasMaxLength(160).IsRequired();
        b.Property(x => x.ServiceType).HasMaxLength(120).IsRequired();
        b.Property(x => x.Message).HasMaxLength(4000).IsRequired();
    }
}

public class SiteSettingsConfiguration : IEntityTypeConfiguration<SiteSettings>
{
    public void Configure(EntityTypeBuilder<SiteSettings> b)
    {
        b.Property(x => x.Phone).HasMaxLength(40);
        b.Property(x => x.Email).HasMaxLength(200);
        b.Property(x => x.Address).HasMaxLength(300);
        b.Property(x => x.GoogleMapEmbed).HasMaxLength(1000);
        b.Property(x => x.FacebookUrl).HasMaxLength(300);
        b.Property(x => x.InstagramUrl).HasMaxLength(300);
        b.Property(x => x.LinkedinUrl).HasMaxLength(300);
    }
}

public class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> b)
    {
        b.Property(x => x.FullName).HasMaxLength(120).IsRequired();
        b.Property(x => x.Email).HasMaxLength(200).IsRequired();
        b.HasIndex(x => x.Email).IsUnique();
        b.Property(x => x.PasswordHash).IsRequired();
        b.Property(x => x.PasswordSalt).IsRequired();
        b.Property(x => x.Role).HasMaxLength(40).IsRequired();

        b.HasMany(x => x.RefreshTokens)
            .WithOne(t => t.User!)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> b)
    {
        b.Property(x => x.Token).HasMaxLength(256).IsRequired();
        b.HasIndex(x => x.Token);
        b.Ignore(x => x.IsActive);
    }
}
