using System.Text;
using System.Text.RegularExpressions;
using FluentValidation;
using HasanHabibSeyda.Domain.Entities;

namespace HasanHabibSeyda.Application.Features.Blogs.Common;

/// <summary>Create + Update komutlarinin paylastigi yazma alanlari.</summary>
public interface IBlogWriteCommand
{
    string Title { get; }
    string Slug { get; }
    string Excerpt { get; }
    string Content { get; }
    string CoverImageUrl { get; }
    string CoverImageAlt { get; }
    string Category { get; }
    List<string> Tags { get; }
    string Author { get; }
    string Status { get; }
    DateTime? PublishedAt { get; }
    string SeoTitle { get; }
    string SeoDescription { get; }
    string CanonicalUrl { get; }
    string OgTitle { get; }
    string OgDescription { get; }
    string OgImageUrl { get; }
    bool NoIndex { get; }
}

/// <summary>Blog yazma islemleri icin ortak yardimcilar (slug, okuma suresi, durum gecisi, alan kopyalama).</summary>
public static class BlogWrite
{
    /// <summary>Turkce karakterleri sadeleştirerek URL-guvenli slug uretir.</summary>
    public static string Slugify(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        var s = input.Trim()
            .Replace('İ', 'I').Replace('I', 'i').Replace('ı', 'i')
            .Replace('Ç', 'c').Replace('ç', 'c')
            .Replace('Ğ', 'g').Replace('ğ', 'g')
            .Replace('Ö', 'o').Replace('ö', 'o')
            .Replace('Ş', 's').Replace('ş', 's')
            .Replace('Ü', 'u').Replace('ü', 'u')
            .ToLowerInvariant();

        var sb = new StringBuilder(s.Length);
        foreach (var ch in s)
        {
            if (ch is (>= 'a' and <= 'z') or (>= '0' and <= '9'))
                sb.Append(ch);
            else if (char.IsWhiteSpace(ch) || ch is '-' or '_' or '.' or '/')
                sb.Append('-');
            // diger tum karakterler atilir
        }

        return Regex.Replace(sb.ToString(), "-{2,}", "-").Trim('-');
    }

    /// <summary>Icerikten tahmini okuma suresi (dakika, ~200 kelime/dk, en az 1).</summary>
    public static int EstimateReadingMinutes(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) return 1;
        var words = content.Split(
            new[] { ' ', '\t', '\n', '\r', '.', ',', ';', ':' },
            StringSplitOptions.RemoveEmptyEntries).Length;
        return Math.Max(1, (int)Math.Ceiling(words / 200.0));
    }

    /// <summary>Durum gecisini uygular; yayin/arsiv zaman damgalarini tutarli tutar.</summary>
    public static void ApplyStatus(BlogPost e, string status, DateTime? publishedAt, DateTime now)
    {
        e.Status = status;
        if (publishedAt.HasValue) e.PublishedAt = publishedAt;
        if (status == BlogStatuses.Published && e.PublishedAt is null) e.PublishedAt = now;
        e.ArchivedAt = status == BlogStatuses.Archived ? (e.ArchivedAt ?? now) : null;
    }

    /// <summary>Komut alanlarini entity'ye kopyalar (slug + okuma suresi + durum dahil). Yeni slug'lari PreviousSlugs'a tasir.</summary>
    public static void Apply(BlogPost e, IBlogWriteCommand src, DateTime now)
    {
        var newSlug = Slugify(string.IsNullOrWhiteSpace(src.Slug) ? src.Title : src.Slug);

        // Yayindaki bir yazinin slug'i degistiyse eski slug'i 301 icin sakla
        if (!string.IsNullOrEmpty(e.Slug) && e.Slug != newSlug && !e.PreviousSlugs.Contains(e.Slug))
            e.PreviousSlugs.Add(e.Slug);

        e.Title = src.Title.Trim();
        e.Slug = newSlug;
        e.Excerpt = src.Excerpt.Trim();
        e.Content = src.Content.Trim();
        e.CoverImageUrl = src.CoverImageUrl.Trim();
        e.CoverImageAlt = src.CoverImageAlt.Trim();
        e.Category = src.Category.Trim();
        e.Tags = src.Tags.Select(t => t.Trim()).Where(t => t.Length > 0).Distinct().ToList();
        e.Author = src.Author.Trim();
        e.ReadingMinutes = EstimateReadingMinutes(src.Content);

        e.SeoTitle = src.SeoTitle.Trim();
        e.SeoDescription = src.SeoDescription.Trim();
        e.CanonicalUrl = src.CanonicalUrl.Trim();
        e.OgTitle = src.OgTitle.Trim();
        e.OgDescription = src.OgDescription.Trim();
        e.OgImageUrl = src.OgImageUrl.Trim();
        e.NoIndex = src.NoIndex;

        e.UpdatedDate = now;
        ApplyStatus(e, src.Status, src.PublishedAt, now);
    }
}

/// <summary>Create + Update komutlari icin ortak FluentValidation kurallari.</summary>
public abstract class BlogWriteCommandValidator<T> : AbstractValidator<T>
    where T : IBlogWriteCommand
{
    protected BlogWriteCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Başlık zorunludur.").MaximumLength(200);
        RuleFor(x => x.Slug).MaximumLength(200);
        RuleFor(x => x.Excerpt).NotEmpty().WithMessage("Kısa özet zorunludur.").MaximumLength(500);
        RuleFor(x => x.Content).NotEmpty().WithMessage("İçerik zorunludur.");
        RuleFor(x => x.CoverImageUrl).MaximumLength(500);
        RuleFor(x => x.CoverImageAlt).MaximumLength(300);
        RuleFor(x => x.Category).MaximumLength(120);
        RuleFor(x => x.Author).MaximumLength(120);
        RuleFor(x => x.Status)
            .Must(BlogStatuses.IsValid).WithMessage("Geçersiz durum değeri.");
        RuleFor(x => x.SeoTitle).MaximumLength(200);
        RuleFor(x => x.SeoDescription).MaximumLength(400);
        RuleFor(x => x.CanonicalUrl).MaximumLength(300);
        RuleFor(x => x.OgTitle).MaximumLength(200);
        RuleFor(x => x.OgDescription).MaximumLength(400);
        RuleFor(x => x.OgImageUrl).MaximumLength(500);
        RuleFor(x => x.CoverImageAlt)
            .NotEmpty()
            .When(x => !string.IsNullOrWhiteSpace(x.CoverImageUrl))
            .WithMessage("Kapak görseli eklediyseniz erişilebilirlik için alt metin girin.");
    }
}
