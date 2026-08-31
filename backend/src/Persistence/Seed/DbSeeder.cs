using System.Text.Json;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Persistence.Seed;

/// <summary>
/// Baslangic verisi. Icerik frontend lib/api/mock-data.ts + lib/site.ts ile ayni tutulmustur;
/// boylece API devreye girince site gorunumu birebir korunur.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IPasswordHasher hasher, CancellationToken ct = default)
    {
        await SeedServicesAsync(db, ct);
        await SeedStatsAsync(db, ct);
        await SeedProcessStepsAsync(db, ct);
        await SeedValuesAsync(db, ct);
        await SeedTestimonialsAsync(db, ct);
        await SeedReviewsAsync(db, ct);
        await SeedVideoTestimonialsAsync(db, ct);
        await SeedCaseStudiesAsync(db, ct);
        await SeedSiteSettingsAsync(db, ct);
        await SeedAdminUserAsync(db, hasher, ct);

        // Phase 3
        await SeedSeoSettingsAsync(db, ct);
        await SeedAnalyticsSettingAsync(db, ct);
        await SeedConversionSettingAsync(db, ct);
        await SeedAboutSettingAsync(db, ct);

        // Blog — baslangic icerigi (gomulu blog-seed.json)
        await SeedBlogPostsAsync(db, ct);

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedSeoSettingsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.SeoSettings.AnyAsync(ct)) return;

        db.SeoSettings.AddRange(
            new SeoSetting { PageKey = "home", PageName = "Ana Sayfa", Title = "Odak Ads Reklam", Description = "Google Ads ile büyümenizi hızlandırıyoruz. Performans odaklı kampanya yönetimiyle reklam bütçenizi ölçülebilir kâra dönüştürün.", Keywords = "Google Ads ajansı, Google Ads yönetimi, performans pazarlama, ROAS", CanonicalUrl = "/" },
            new SeoSetting { PageKey = "about", PageName = "Hakkımızda", Title = "Hakkımızda | Odak Ads Reklam", Description = "Odak Ads Reklam; veriye dayalı, şeffaf ve sonuç odaklı Google Ads yönetimiyle markaların büyümesini hızlandıran bir ajansıdır.", Keywords = "Google Ads uzmanı, dijital reklam ajansı", CanonicalUrl = "/hakkimizda" },
            new SeoSetting { PageKey = "services", PageName = "Hizmetler", Title = "Hizmetler | Odak Ads Reklam", Description = "Google Ads yönetimi, arama ağı, görüntülü, YouTube, Performance Max, yeniden pazarlama, dönüşüm takibi ve A/B testleri.", Keywords = "Performance Max, arama ağı reklamları, yeniden pazarlama, dönüşüm takibi", CanonicalUrl = "/hizmetler" },
            new SeoSetting { PageKey = "success", PageName = "Başarılarımız", Title = "Başarılarımız | Odak Ads Reklam", Description = "Gerçek müşteri yorumları, video referanslar ve önce/sonra vaka çalışmalarıyla kanıtlanmış Google Ads büyüme sonuçları.", Keywords = "Google Ads başarı hikayeleri, vaka çalışması, müşteri yorumları", CanonicalUrl = "/basarilarimiz" },
            new SeoSetting { PageKey = "contact", PageName = "İletişim", Title = "İletişim | Odak Ads Reklam", Description = "Ücretsiz Google Ads hesap analizi için bizimle iletişime geçin. 24 saat içinde dönüş yapıyoruz.", Keywords = "Google Ads iletişim, ücretsiz analiz, danışmanlık", CanonicalUrl = "/iletisim" }
        );
    }

    private static async Task SeedAnalyticsSettingAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.AnalyticsSettings.AnyAsync(ct)) return;
        db.AnalyticsSettings.Add(new AnalyticsSetting { IsActive = false });
    }

    private static async Task SeedConversionSettingAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.ConversionSettings.AnyAsync(ct)) return;
        db.ConversionSettings.Add(new ConversionSetting
        {
            IsWhatsappEnabled = false,
            WhatsappDefaultMessage = "Merhaba, Google Ads hizmetleriniz hakkında bilgi almak istiyorum.",
            IsClickToCallEnabled = false,
            IsCalendlyEnabled = false,
            PrimaryCtaText = "Ücretsiz Danışmanlık Al",
            PrimaryCtaUrl = "/iletisim",
            SecondaryCtaText = "Başarı Hikayeleri",
            SecondaryCtaUrl = "/basarilarimiz",
        });
    }

    private static async Task SeedAboutSettingAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.AboutSettings.AnyAsync(ct)) return;
        db.AboutSettings.Add(new AboutSetting
        {
            FounderName = "",
            FounderTitle = "",
            FounderDescription = "",
            CompanyStory = "Odak Ads Reklam, dijital reklamcılığın 'bütçe yakma' olarak görüldüğü bir dönemde farklı bir soruyla yola çıktı: 'Her kuruş ne kadar getiri sağlıyor?' Bugün farklı sektörlerden 150'den fazla markanın Google Ads bütçesini veriye dayalı şekilde yönetiyoruz.",
            MissionText = "İşletmelerin Google Ads yatırımlarını ölçülebilir, sürdürülebilir ve kârlı büyümeye dönüştürmek; her müşterimize gerçek bir büyüme ortağı olmak.",
            VisionText = "Türkiye'nin performans pazarlamasında en çok güvenilen Google Ads ajansı olmak; veriye dayalı, etik ve şeffaf reklamcılığın standardını belirlemek.",
        });
    }

    private static async Task SeedServicesAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.Services.AnyAsync(ct)) return;

        db.Services.AddRange(
            new Service { Slug = "google-ads-yonetimi", Title = "Google Ads Yönetimi", Icon = "Target", DisplayOrder = 1, Description = "Hesabınızın baştan sona kurulumu, optimizasyonu ve günlük yönetimi. Bütçenizi en yüksek getiriyi sağlayacak şekilde yönetiyoruz.", Features = new() { "Hesap denetimi", "Bütçe optimizasyonu", "Haftalık raporlama" } },
            new Service { Slug = "arama-agi-reklamlari", Title = "Arama Ağı Reklamları", Icon = "Search", DisplayOrder = 2, Description = "Tam alım niyetindeki kullanıcıları yakalayan, dönüşüm odaklı arama kampanyaları kurar ve sürekli optimize ederiz.", Features = new() { "Anahtar kelime analizi", "Negatif kelime yönetimi", "Reklam metni testleri" } },
            new Service { Slug = "goruntulu-reklamlar", Title = "Görüntülü Reklamlar", Icon = "Image", DisplayOrder = 3, Description = "Milyonlarca sitede markanızı görünür kılan, akıllı hedefleme ile doğru kitleye ulaşan görüntülü reklam kampanyaları.", Features = new() { "Görsel banner tasarımı", "Kitle hedefleme", "Marka bilinirliği" } },
            new Service { Slug = "youtube-reklamlari", Title = "YouTube Reklamları", Icon = "Youtube", DisplayOrder = 4, Description = "Video ile hikayenizi anlatın. İzlenme, etkileşim ve dönüşüm odaklı YouTube kampanyalarıyla geniş kitlelere ulaşın.", Features = new() { "Video kampanya kurulumu", "Hedef kitle eşleştirme", "İzlenme optimizasyonu" } },
            new Service { Slug = "performance-max", Title = "Performance Max", Icon = "Zap", DisplayOrder = 5, Description = "Google'ın tüm envanterini tek kampanyada birleştiren yapay zekâ destekli Performance Max ile maksimum dönüşüm.", Features = new() { "Varlık grubu yönetimi", "Sinyal optimizasyonu", "Otomasyon kontrolü" } },
            new Service { Slug = "yeniden-pazarlama", Title = "Yeniden Pazarlama", Icon = "Repeat", DisplayOrder = 6, Description = "Sitenizi ziyaret eden ama dönüşmeyen kullanıcıları akıllı remarketing senaryolarıyla geri kazanıyoruz.", Features = new() { "Kitle segmentasyonu", "Dinamik remarketing", "Sepet kurtarma" } },
            new Service { Slug = "donusum-takibi", Title = "Dönüşüm Takibi", Icon = "LineChart", DisplayOrder = 7, Description = "GA4, Google Tag Manager ve gelişmiş dönüşüm kurulumuyla her kuruşun nereye gittiğini net biçimde ölçümleriz.", Features = new() { "GA4 & GTM kurulumu", "Gelişmiş dönüşümler", "Sunucu taraflı izleme" } },
            new Service { Slug = "ab-testleri", Title = "A/B Testleri", Icon = "FlaskConical", DisplayOrder = 8, Description = "Reklam metni, açılış sayfası ve teklif stratejilerini veriye dayalı A/B testleriyle sürekli iyileştiririz.", Features = new() { "Hipotez kurulumu", "Açılış sayfası testi", "İstatistiksel anlamlılık" } }
        );
    }

    private static async Task SeedStatsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.Stats.AnyAsync(ct)) return;

        db.Stats.AddRange(
            new Stat { Label = "Mutlu Müşteri", Value = 150, Suffix = "+", Icon = "Users", DisplayOrder = 1 },
            new Stat { Label = "Yönetilen Bütçe", Value = 50, Prefix = "₺", Suffix = "M+", Icon = "Wallet", DisplayOrder = 2 },
            new Stat { Label = "Ortalama ROAS Artışı", Value = 90, Suffix = "%+", Icon = "TrendingUp", DisplayOrder = 3 },
            new Stat { Label = "Yönetilen Kampanya", Value = 1200, Suffix = "+", Icon = "Megaphone", DisplayOrder = 4 }
        );
    }

    private static async Task SeedProcessStepsAsync(AppDbContext db, CancellationToken ct)
    {
        // Once yanlis upsert ile bozulmus olabilecegi icin orijinal icerige senkronize et.
        var desired = new (int Step, string Title, string Icon, string Description)[]
        {
            (1, "Keşif & Analiz", "Search", "Sektörünüzü, rakiplerinizi ve mevcut hesabınızı derinlemesine analiz ederek fırsatları belirleriz."),
            (2, "Strateji & Kurulum", "PencilRuler", "Hedeflerinize özel kampanya mimarisi, hedefleme ve dönüşüm takip altyapısını kurarız."),
            (3, "Optimizasyon", "Settings2", "Teklifler, anahtar kelimeler ve reklam metinlerini veriye dayalı olarak sürekli iyileştiririz."),
            (4, "Raporlama & Büyüme", "TrendingUp", "Şeffaf raporlarla sonuçları paylaşır, ölçeklenebilir büyüme planını birlikte uygularız."),
        };

        var existing = await db.ProcessSteps.ToListAsync(ct);
        if (existing.Count == 0)
        {
            db.ProcessSteps.AddRange(desired.Select(d => new ProcessStep
            {
                Step = d.Step,
                Title = d.Title,
                Icon = d.Icon,
                Description = d.Description,
            }));
            return;
        }

        foreach (var d in desired)
        {
            var row = existing.FirstOrDefault(x => x.Step == d.Step);
            if (row is null)
            {
                db.ProcessSteps.Add(new ProcessStep
                {
                    Step = d.Step,
                    Title = d.Title,
                    Icon = d.Icon,
                    Description = d.Description,
                });
                continue;
            }

            row.Title = d.Title;
            row.Icon = d.Icon;
            row.Description = d.Description;
        }
    }

    private static async Task SeedValuesAsync(AppDbContext db, CancellationToken ct)
    {
        var desired = new (int DisplayOrder, string Title, string Icon, string Description)[]
        {
            (1, "Şeffaflık", "Eye", "Reklam harcamalarınızı ve kampanya detaylarını açıkça paylaşıyoruz. Tüm raporları net ve anlaşılır bir şekilde sunmaya özen gösteriyoruz."),
            (2, "Veriye Dayalı Analiz", "BarChart3", "Kampanya adımlarını mevcut veriler doğrultusunda şekillendiriyoruz. İlerlememizi ölçülebilir ve net sonuçlara dayandırıyoruz."),
            (3, "Düzenli Takip", "Activity", "Reklam performansını yakından kontrol ediyor, bütçenizin verimli kullanılması için gerekli teknik güncellemeleri yapıyoruz."),
            (4, "Net İletişim", "MessageCircle", "Süreç boyunca sorularınıza açık yanıtlar veriyor, reklam yönetimini sizinle sürekli bilgi paylaşımı içinde yürütüyoruz."),
        };

        var existing = await db.CompanyValues.ToListAsync(ct);
        if (existing.Count == 0)
        {
            db.CompanyValues.AddRange(desired.Select(d => new CompanyValue
            {
                DisplayOrder = d.DisplayOrder,
                Title = d.Title,
                Icon = d.Icon,
                Description = d.Description,
            }));
            return;
        }

        // Admin CRUD yok — içerik güncellemesini seed ile senkron tut.
        foreach (var d in desired)
        {
            var row = existing.FirstOrDefault(x => x.DisplayOrder == d.DisplayOrder);
            if (row is null)
            {
                db.CompanyValues.Add(new CompanyValue
                {
                    DisplayOrder = d.DisplayOrder,
                    Title = d.Title,
                    Icon = d.Icon,
                    Description = d.Description,
                });
                continue;
            }

            row.Title = d.Title;
            row.Icon = d.Icon;
            row.Description = d.Description;
        }
    }

    private static async Task SeedTestimonialsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.Testimonials.AnyAsync(ct)) return;

        db.Testimonials.AddRange(
            new Testimonial { Name = "Elif Demir", Role = "Pazarlama Direktörü", Company = "ModaVitrin", Rating = 5, IsFeatured = true, Content = "İlk 3 ayda ROAS'ımız 1.9'dan 4.7'ye çıktı. Şeffaf raporlama ve hızlı iletişim gerçekten fark yaratıyor." },
            new Testimonial { Name = "Mehmet Kaya", Role = "Kurucu", Company = "TeknoParça", Rating = 5, IsFeatured = true, Content = "E-ticaret cirosunu 6 ayda 3 katına çıkardık. Performance Max kurgusu işimizi tamamen değiştirdi." },
            new Testimonial { Name = "Zeynep Arslan", Role = "Genel Müdür", Company = "SağlıkClinic", Rating = 5, Content = "Randevu maliyetimiz %60 düştü. Veriye dayalı yaklaşımları sayesinde bütçemizi çok daha verimli kullanıyoruz." },
            new Testimonial { Name = "Caner Yıldız", Role = "E-ticaret Müdürü", Company = "EvDekor", Rating = 5, Content = "Aylık raporlar net, aksiyonlar hızlı. Reklam yatırımımızın geri dönüşünü ilk kez bu kadar net görüyoruz." }
        );
    }

    private static async Task SeedReviewsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.Reviews.AnyAsync(ct)) return;

        db.Reviews.AddRange(
            new Review { Author = "Semih S.", Service = "Google Ads Uzmanı", Rating = 5, Source = "Armut", Date = new DateTime(2026, 6, 23), Comment = "Hasan beyle ilk çalışmamız gerçekten kendi işi gibi ilgilendi, düzenli kontrol etti çok memnun kaldık. İnşallah daha da devam edeceğiz kendisi ile teşekkür ederim 😊" },
            new Review { Author = "Davut Ö.", Service = "Google Ads Uzmanı", Rating = 5, Source = "Armut", Date = new DateTime(2026, 6, 2), Comment = "Gebze de branda sektöründe hizmet veriyorum armuttan ulaştı hasan bey bana reklamları sorunsuz kurdu sonrasında işinin her daim peşinde durdu ne zaman ulaşmak istersem cevap verdi kendisine teşekkür ederim gönül rahatlığıyla tavsiye edebilirim size" },
            new Review { Author = "Yasin Ç.", Service = "Google Reklam Yönetimi", Rating = 5, Source = "Armut", Date = new DateTime(2026, 5, 28), Comment = "Alanında uzman ve ilgili kişi spam yiyen profilimi aktif etti işin takibini yaptı teşekkürler şiddetle tavsiye ederim" },
            new Review { Author = "Yasin Ö.", Service = "Google Ads Uzmanı", Rating = 5, Source = "Armut", Date = new DateTime(2026, 4, 27), Comment = "Gerçekten işini çok düzgün yapan biri. Süreç boyunca ilgisi çok iyiydi, sürekli bilgilendirme yaptı ve söylediği her şeyi eksiksiz yerine getirdi. Uğraşıyor, takip ediyor ve güven veriyor. Gönül rahatlığıyla çalışabilirsiniz 👍" },
            new Review { Author = "Münteha K.", Service = "Google Ads Danışmanlık", Rating = 5, Source = "Armut", Date = new DateTime(2026, 3, 18), Comment = "Gayet ilgili ve işinde özenli bir ads uzmanı tavsiye ederim üstelik haksız yorum kaldırma konusunda da çok başarılı" },
            new Review { Author = "Ayhan E.", Service = "Google Ads Uzmanı", Rating = 5, Source = "Armut", Date = new DateTime(2026, 4, 20), Comment = "Google Ads reklamlarımı güzel birşekilde kurguladı ve düzenledi, kendisi uygun fiyata yaptı tavsiye ederim." }
        );
    }

    private static async Task SeedVideoTestimonialsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.VideoTestimonials.AnyAsync(ct)) return;

        db.VideoTestimonials.AddRange(
            new VideoTestimonial { Name = "Deniz Aktaş", Company = "UrbanWear", VideoUrl = "https://www.youtube.com/embed/ScMzIvxBSi4", Duration = "2:14", DisplayOrder = 1, Quote = "6 ayda online ciromuzu 4 katına çıkardık." },
            new VideoTestimonial { Name = "Pınar Çelik", Company = "GurmeSepeti", VideoUrl = "https://www.youtube.com/embed/ScMzIvxBSi4", Duration = "1:52", DisplayOrder = 2, Quote = "ROAS'ımız ilk çeyrekte 5'in üzerine çıktı." },
            new VideoTestimonial { Name = "Emre Şahin", Company = "FitLife", VideoUrl = "https://www.youtube.com/embed/ScMzIvxBSi4", Duration = "2:38", DisplayOrder = 3, Quote = "Üyelik başına maliyetimiz yarı yarıya düştü." }
        );
    }

    private static async Task SeedCaseStudiesAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.CaseStudies.AnyAsync(ct)) return;

        db.CaseStudies.AddRange(
            new CaseStudy
            {
                Client = "ModaVitrin", Industry = "E-ticaret / Moda", Growth = "+380%", DisplayOrder = 1,
                Summary = "Performance Max ve dinamik remarketing kombinasyonuyla 4 ayda kârlı ölçeklendirme.",
                Tags = new() { "Performance Max", "Remarketing", "E-ticaret" },
                Metrics = new()
                {
                    new CaseStudyMetric { Label = "Aylık Ciro", Before = "50.000 ₺", After = "240.000 ₺", DisplayOrder = 0 },
                    new CaseStudyMetric { Label = "ROAS", Before = "1.8", After = "5.2", DisplayOrder = 1 },
                    new CaseStudyMetric { Label = "Dönüşüm Oranı", Before = "%1,2", After = "%3,4", DisplayOrder = 2 },
                },
            },
            new CaseStudy
            {
                Client = "SağlıkClinic", Industry = "Sağlık Hizmetleri", Growth = "+300%", DisplayOrder = 2,
                Summary = "Arama ağı yeniden yapılandırması ile nitelikli randevu sayısında ciddi artış.",
                Tags = new() { "Arama Ağı", "Dönüşüm Takibi", "Yerel" },
                Metrics = new()
                {
                    new CaseStudyMetric { Label = "Randevu / Ay", Before = "45", After = "180", DisplayOrder = 0 },
                    new CaseStudyMetric { Label = "Randevu Maliyeti", Before = "320 ₺", After = "128 ₺", DisplayOrder = 1 },
                    new CaseStudyMetric { Label = "ROAS", Before = "2.1", After = "4.8", DisplayOrder = 2 },
                },
            },
            new CaseStudy
            {
                Client = "TeknoParça", Industry = "B2B / Teknoloji", Growth = "+241%", DisplayOrder = 3,
                Summary = "Akıllı teklif stratejileri ve A/B testleriyle teklif başına maliyette düşüş.",
                Tags = new() { "B2B", "A/B Test", "Akıllı Teklif" },
                Metrics = new()
                {
                    new CaseStudyMetric { Label = "Aylık Talep", Before = "120", After = "410", DisplayOrder = 0 },
                    new CaseStudyMetric { Label = "Talep Maliyeti", Before = "210 ₺", After = "95 ₺", DisplayOrder = 1 },
                    new CaseStudyMetric { Label = "ROAS", Before = "2.4", After = "6.1", DisplayOrder = 2 },
                },
            }
        );
    }

    private static async Task SeedSiteSettingsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.SiteSettings.AnyAsync(ct)) return;

        db.SiteSettings.Add(new SiteSettings
        {
            Phone = "+90 (212) 000 00 00",
            Email = "info@odakadsreklam.com",
            Address = "Maslak Mah. Büyükdere Cad. No:255, Sarıyer / İstanbul",
            GoogleMapEmbed = "https://www.google.com/maps?q=Maslak%20Istanbul&output=embed",
            LinkedinUrl = "https://www.linkedin.com/",
            InstagramUrl = "https://www.instagram.com/",
            FacebookUrl = "https://www.facebook.com/",
        });
    }

    private static async Task SeedAdminUserAsync(AppDbContext db, IPasswordHasher hasher, CancellationToken ct)
    {
        if (await db.AdminUsers.AnyAsync(ct)) return;

        var (hash, salt) = hasher.HashPassword("Admin123!");
        db.AdminUsers.Add(new AdminUser
        {
            FullName = "Odak Ads Reklam",
            Email = "admin@odakadsreklam.com",
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = "Admin",
            IsActive = true,
        });
    }

    /// <summary>
    /// Baslangic blog yazilarini gomulu 'blog-seed.json' kaynagindan ekler (yalnizca tablo bosken).
    /// Kaynak okunamaz/ayristirilamazsa baslangici KESMEZ (bloglar site build verisinden yine gelir).
    /// </summary>
    private static async Task SeedBlogPostsAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.BlogPosts.AnyAsync(ct)) return;

        try
        {
            var asm = typeof(DbSeeder).Assembly;
            var resourceName = System.Array.Find(
                asm.GetManifestResourceNames(),
                n => n.EndsWith("blog-seed.json", StringComparison.OrdinalIgnoreCase));
            if (resourceName is null) return;

            await using var stream = asm.GetManifestResourceStream(resourceName);
            if (stream is null) return;

            var items = await JsonSerializer.DeserializeAsync<List<BlogSeedItem>>(
                stream,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
                ct);
            if (items is null || items.Count == 0) return;

            foreach (var it in items)
            {
                if (string.IsNullOrWhiteSpace(it.Slug)) continue;
                var published = ParseUtc(it.PublishedAt) ?? DateTime.UtcNow;

                db.BlogPosts.Add(new BlogPost
                {
                    Id = Guid.TryParse(it.Id, out var g) ? g : Guid.NewGuid(),
                    Title = it.Title ?? string.Empty,
                    Slug = it.Slug!,
                    Excerpt = it.Excerpt ?? string.Empty,
                    Content = it.Content ?? string.Empty,
                    CoverImageUrl = it.CoverImageUrl ?? string.Empty,
                    CoverImageAlt = it.CoverImageAlt ?? string.Empty,
                    Category = it.Category ?? string.Empty,
                    Tags = it.Tags ?? new List<string>(),
                    Author = it.Author ?? string.Empty,
                    ReadingMinutes = it.ReadingMinutes,
                    Status = BlogStatuses.Published,
                    PublishedAt = published,
                    CreatedDate = published,
                    UpdatedDate = ParseUtc(it.UpdatedAt) ?? published,
                    SeoTitle = it.SeoTitle ?? string.Empty,
                    SeoDescription = it.SeoDescription ?? string.Empty,
                    CanonicalUrl = it.CanonicalUrl ?? string.Empty,
                    OgTitle = it.OgTitle ?? string.Empty,
                    OgDescription = it.OgDescription ?? string.Empty,
                    OgImageUrl = it.OgImageUrl ?? string.Empty,
                    NoIndex = it.NoIndex,
                    PreviousSlugs = new List<string>(),
                });
            }
        }
        catch
        {
            // Seed dosyasi okunamaz/ayristirilamazsa yut — baslangici kesme.
        }
    }

    private static DateTime? ParseUtc(string? s) =>
        DateTime.TryParse(
            s,
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.AdjustToUniversal | System.Globalization.DateTimeStyles.AssumeUniversal,
            out var d)
            ? d
            : null;

    private sealed class BlogSeedItem
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? Excerpt { get; set; }
        public string? Content { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? CoverImageAlt { get; set; }
        public string? Category { get; set; }
        public List<string>? Tags { get; set; }
        public string? Author { get; set; }
        public int ReadingMinutes { get; set; }
        public string? PublishedAt { get; set; }
        public string? UpdatedAt { get; set; }
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public string? CanonicalUrl { get; set; }
        public string? OgTitle { get; set; }
        public string? OgDescription { get; set; }
        public string? OgImageUrl { get; set; }
        public bool NoIndex { get; set; }
    }
}
