using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HasanHabibSeyda.Persistence.Configurations;

public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
{
    public void Configure(EntityTypeBuilder<BlogPost> b)
    {
        b.Property(x => x.Title).HasMaxLength(200).IsRequired();

        b.Property(x => x.Slug).HasMaxLength(200).IsRequired();
        b.HasIndex(x => x.Slug).IsUnique();

        b.Property(x => x.Excerpt).HasMaxLength(500).IsRequired();
        b.Property(x => x.Content).IsRequired(); // nvarchar(max) — Markdown govde
        b.Property(x => x.CoverImageUrl).HasMaxLength(500);
        b.Property(x => x.CoverImageAlt).HasMaxLength(300);
        b.Property(x => x.Category).HasMaxLength(120);
        b.Property(x => x.Author).HasMaxLength(120);

        b.Property(x => x.Status).HasMaxLength(20).IsRequired();
        b.HasIndex(x => new { x.Status, x.PublishedAt });

        b.Property(x => x.SeoTitle).HasMaxLength(200);
        b.Property(x => x.SeoDescription).HasMaxLength(400);
        b.Property(x => x.CanonicalUrl).HasMaxLength(300);
        b.Property(x => x.OgTitle).HasMaxLength(200);
        b.Property(x => x.OgDescription).HasMaxLength(400);
        b.Property(x => x.OgImageUrl).HasMaxLength(500);

        b.Property(x => x.Tags)
            .HasConversion(StringListConverter.Converter)
            .Metadata.SetValueComparer(StringListConverter.Comparer);

        b.Property(x => x.PreviousSlugs)
            .HasConversion(StringListConverter.Converter)
            .Metadata.SetValueComparer(StringListConverter.Comparer);
    }
}
