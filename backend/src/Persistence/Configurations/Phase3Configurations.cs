using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HasanHabibSeyda.Persistence.Configurations;

public class SeoSettingConfiguration : IEntityTypeConfiguration<SeoSetting>
{
    public void Configure(EntityTypeBuilder<SeoSetting> b)
    {
        b.Property(x => x.PageKey).HasMaxLength(40).IsRequired();
        b.HasIndex(x => x.PageKey).IsUnique();
        b.Property(x => x.PageName).HasMaxLength(120).IsRequired();
        b.Property(x => x.Title).HasMaxLength(200);
        b.Property(x => x.Description).HasMaxLength(400);
        b.Property(x => x.Keywords).HasMaxLength(400);
        b.Property(x => x.CanonicalUrl).HasMaxLength(300);
    }
}

public class AnalyticsSettingConfiguration : IEntityTypeConfiguration<AnalyticsSetting>
{
    public void Configure(EntityTypeBuilder<AnalyticsSetting> b)
    {
        b.Property(x => x.GoogleAnalyticsMeasurementId).HasMaxLength(60);
        b.Property(x => x.GoogleTagManagerId).HasMaxLength(60);
        b.Property(x => x.GoogleSearchConsoleVerificationCode).HasMaxLength(200);
        b.Property(x => x.MicrosoftClarityProjectId).HasMaxLength(60);
        b.Property(x => x.MetaPixelId).HasMaxLength(60);
        b.Property(x => x.LinkedinInsightTagPartnerId).HasMaxLength(60);
    }
}

public class ConversionSettingConfiguration : IEntityTypeConfiguration<ConversionSetting>
{
    public void Configure(EntityTypeBuilder<ConversionSetting> b)
    {
        b.Property(x => x.WhatsappPhoneNumber).HasMaxLength(30);
        b.Property(x => x.WhatsappDefaultMessage).HasMaxLength(500);
        b.Property(x => x.CalendlyUrl).HasMaxLength(300);
        b.Property(x => x.PrimaryCtaText).HasMaxLength(80);
        b.Property(x => x.PrimaryCtaUrl).HasMaxLength(300);
        b.Property(x => x.SecondaryCtaText).HasMaxLength(80);
        b.Property(x => x.SecondaryCtaUrl).HasMaxLength(300);
    }
}

public class AboutSettingConfiguration : IEntityTypeConfiguration<AboutSetting>
{
    public void Configure(EntityTypeBuilder<AboutSetting> b)
    {
        b.Property(x => x.FounderName).HasMaxLength(120);
        b.Property(x => x.FounderTitle).HasMaxLength(120);
        b.Property(x => x.FounderDescription).HasMaxLength(1500);
        b.Property(x => x.CompanyStory).HasMaxLength(3000);
        b.Property(x => x.MissionText).HasMaxLength(1500);
        b.Property(x => x.VisionText).HasMaxLength(1500);
    }
}
