/**
 * GECICI statik veri.
 *
 * Tum icerik DTO tipinde tutulur; gercek ASP.NET Core Web API devreye
 * girdiginde (NEXT_PUBLIC_USE_MOCK=false) endpoints.ts
 * otomatik olarak API'ye gecer ve bu dosya kullanim disi kalir.
 */

import type {
  CaseStudyDto,
  ProcessStepDto,
  ReferenceCompanyDto,
  ReviewDto,
  ServiceDto,
  StatDto,
  TestimonialDto,
  ValueDto,
  VideoTestimonialDto,
} from "./types";

export const mockServices: ServiceDto[] = [
  {
    id: "svc-1",
    slug: "google-ads-yonetimi",
    title: "Google Ads Yönetimi",
    description:
      "Hesabınızın baştan sona kurulumu, optimizasyonu ve günlük yönetimi. Bütçenizi en yüksek getiriyi sağlayacak şekilde yönetiyoruz.",
    icon: "Target",
    features: ["Hesap denetimi", "Bütçe optimizasyonu", "Haftalık raporlama"],
    order: 1,
  },
  {
    id: "svc-2",
    slug: "arama-agi-reklamlari",
    title: "Arama Ağı Reklamları",
    description:
      "Tam alım niyetindeki kullanıcıları yakalayan, dönüşüm odaklı arama kampanyaları kurar ve sürekli optimize ederiz.",
    icon: "Search",
    features: ["Anahtar kelime analizi", "Negatif kelime yönetimi", "Reklam metni testleri"],
    order: 2,
  },
  {
    id: "svc-3",
    slug: "goruntulu-reklamlar",
    title: "Görüntülü Reklamlar",
    description:
      "Milyonlarca sitede markanızı görünür kılan, akıllı hedefleme ile doğru kitleye ulaşan görüntülü reklam kampanyaları.",
    icon: "Image",
    features: ["Görsel banner tasarımı", "Kitle hedefleme", "Marka bilinirliği"],
    order: 3,
  },
  {
    id: "svc-4",
    slug: "youtube-reklamlari",
    title: "YouTube Reklamları",
    description:
      "Video ile hikayenizi anlatın. İzlenme, etkileşim ve dönüşüm odaklı YouTube kampanyalarıyla geniş kitlelere ulaşın.",
    icon: "Youtube",
    features: ["Video kampanya kurulumu", "Hedef kitle eşleştirme", "İzlenme optimizasyonu"],
    order: 4,
  },
  {
    id: "svc-5",
    slug: "performance-max",
    title: "Performance Max",
    description:
      "Google'ın tüm envanterini tek kampanyada birleştiren yapay zekâ destekli Performance Max ile maksimum dönüşüm.",
    icon: "Zap",
    features: ["Varlık grubu yönetimi", "Sinyal optimizasyonu", "Otomasyon kontrolü"],
    order: 5,
  },
  {
    id: "svc-6",
    slug: "yeniden-pazarlama",
    title: "Yeniden Pazarlama",
    description:
      "Sitenizi ziyaret eden ama dönüşmeyen kullanıcıları akıllı remarketing senaryolarıyla geri kazanıyoruz.",
    icon: "Repeat",
    features: ["Kitle segmentasyonu", "Dinamik remarketing", "Sepet kurtarma"],
    order: 6,
  },
  {
    id: "svc-7",
    slug: "donusum-takibi",
    title: "Dönüşüm Takibi",
    description:
      "GA4, Google Tag Manager ve gelişmiş dönüşüm kurulumuyla her kuruşun nereye gittiğini net biçimde ölçümleriz.",
    icon: "LineChart",
    features: ["GA4 & GTM kurulumu", "Gelişmiş dönüşümler", "Sunucu taraflı izleme"],
    order: 7,
  },
  {
    id: "svc-8",
    slug: "ab-testleri",
    title: "A/B Testleri",
    description:
      "Reklam metni, açılış sayfası ve teklif stratejilerini veriye dayalı A/B testleriyle sürekli iyileştiririz.",
    icon: "FlaskConical",
    features: ["Hipotez kurulumu", "Açılış sayfası testi", "İstatistiksel anlamlılık"],
    order: 8,
  },
];

export const mockStats: StatDto[] = [
  { id: "stat-1", label: "Mutlu Müşteri", value: 150, suffix: "+", icon: "Users" },
  { id: "stat-2", label: "Yönetilen Bütçe", value: 50, prefix: "₺", suffix: "M+", icon: "Wallet" },
  { id: "stat-3", label: "Ortalama ROAS Artışı", value: 90, suffix: "%+", icon: "TrendingUp" },
  { id: "stat-4", label: "Yönetilen Kampanya", value: 1200, suffix: "+", icon: "Megaphone" },
];

export const mockProcessSteps: ProcessStepDto[] = [
  {
    id: "step-1",
    step: 1,
    title: "Keşif & Analiz",
    description:
      "Sektörünüzü, rakiplerinizi ve mevcut hesabınızı derinlemesine analiz ederek fırsatları belirleriz.",
    icon: "Search",
  },
  {
    id: "step-2",
    step: 2,
    title: "Strateji & Kurulum",
    description:
      "Hedeflerinize özel kampanya mimarisi, hedefleme ve dönüşüm takip altyapısını kurarız.",
    icon: "PencilRuler",
  },
  {
    id: "step-3",
    step: 3,
    title: "Optimizasyon",
    description:
      "Teklifler, anahtar kelimeler ve reklam metinlerini veriye dayalı olarak sürekli iyileştiririz.",
    icon: "Settings2",
  },
  {
    id: "step-4",
    step: 4,
    title: "Raporlama & Büyüme",
    description:
      "Şeffaf raporlarla sonuçları paylaşır, ölçeklenebilir büyüme planını birlikte uygularız.",
    icon: "TrendingUp",
  },
];

export const mockValues: ValueDto[] = [
  {
    id: "val-1",
    title: "Şeffaflık",
    description:
      "Reklam harcamalarınızı ve kampanya detaylarını açıkça paylaşıyoruz. Tüm raporları net ve anlaşılır bir şekilde sunmaya özen gösteriyoruz.",
    icon: "Eye",
  },
  {
    id: "val-2",
    title: "Veriye Dayalı Analiz",
    description:
      "Kampanya adımlarını mevcut veriler doğrultusunda şekillendiriyoruz. İlerlememizi ölçülebilir ve net sonuçlara dayandırıyoruz.",
    icon: "BarChart3",
  },
  {
    id: "val-3",
    title: "Düzenli Takip",
    description:
      "Reklam performansını yakından kontrol ediyor, bütçenizin verimli kullanılması için gerekli teknik güncellemeleri yapıyoruz.",
    icon: "Activity",
  },
  {
    id: "val-4",
    title: "Net İletişim",
    description:
      "Süreç boyunca sorularınıza açık yanıtlar veriyor, reklam yönetimini sizinle sürekli bilgi paylaşımı içinde yürütüyoruz.",
    icon: "MessageCircle",
  },
];

export const mockTestimonials: TestimonialDto[] = [
  {
    id: "tst-1",
    name: "Elif Demir",
    role: "Pazarlama Direktörü",
    company: "ModaVitrin",
    rating: 5,
    content:
      "İlk 3 ayda ROAS'ımız 1.9'dan 4.7'ye çıktı. Şeffaf raporlama ve hızlı iletişim gerçekten fark yaratıyor.",
  },
  {
    id: "tst-2",
    name: "Mehmet Kaya",
    role: "Kurucu",
    company: "TeknoParça",
    rating: 5,
    content:
      "E-ticaret cirosunu 6 ayda 3 katına çıkardık. Performance Max kurgusu işimizi tamamen değiştirdi.",
  },
  {
    id: "tst-3",
    name: "Zeynep Arslan",
    role: "Genel Müdür",
    company: "SağlıkClinic",
    rating: 5,
    content:
      "Randevu maliyetimiz %60 düştü. Veriye dayalı yaklaşımları sayesinde bütçemizi çok daha verimli kullanıyoruz.",
  },
  {
    id: "tst-4",
    name: "Caner Yıldız",
    role: "E-ticaret Müdürü",
    company: "EvDekor",
    rating: 5,
    content:
      "Aylık raporlar net, aksiyonlar hızlı. Reklam yatırımımızın geri dönüşünü ilk kez bu kadar net görüyoruz.",
  },
];

export const mockReviews: ReviewDto[] = [
  {
    id: "rev-1",
    author: "Semih S.",
    service: "Google Ads Uzmanı",
    rating: 5,
    comment:
      "Hasan beyle ilk çalışmamız gerçekten kendi işi gibi ilgilendi, düzenli kontrol etti çok memnun kaldık. İnşallah daha da devam edeceğiz kendisi ile teşekkür ederim 😊",
    date: "2026-06-23",
    source: "Armut",
  },
  {
    id: "rev-2",
    author: "Davut Ö.",
    service: "Google Ads Uzmanı",
    rating: 5,
    comment:
      "Gebze de branda sektöründe hizmet veriyorum armuttan ulaştı hasan bey bana reklamları sorunsuz kurdu sonrasında işinin her daim peşinde durdu ne zaman ulaşmak istersem cevap verdi kendisine teşekkür ederim gönül rahatlığıyla tavsiye edebilirim size",
    date: "2026-06-02",
    source: "Armut",
  },
  {
    id: "rev-3",
    author: "Yasin Ç.",
    service: "Google Reklam Yönetimi",
    rating: 5,
    comment:
      "Alanında uzman ve ilgili kişi spam yiyen profilimi aktif etti işin takibini yaptı teşekkürler şiddetle tavsiye ederim",
    date: "2026-05-28",
    source: "Armut",
  },
  {
    id: "rev-4",
    author: "Yasin Ö.",
    service: "Google Ads Uzmanı",
    rating: 5,
    comment:
      "Gerçekten işini çok düzgün yapan biri. Süreç boyunca ilgisi çok iyiydi, sürekli bilgilendirme yaptı ve söylediği her şeyi eksiksiz yerine getirdi. Uğraşıyor, takip ediyor ve güven veriyor. Gönül rahatlığıyla çalışabilirsiniz 👍",
    date: "2026-04-27",
    source: "Armut",
  },
  {
    id: "rev-5",
    author: "Münteha K.",
    service: "Google Ads Danışmanlık",
    rating: 5,
    comment:
      "Gayet ilgili ve işinde özenli bir ads uzmanı tavsiye ederim üstelik haksız yorum kaldırma konusunda da çok başarılı",
    date: "2026-03-18",
    source: "Armut",
  },
  {
    id: "rev-6",
    author: "Ayhan E.",
    service: "Google Ads Uzmanı",
    rating: 5,
    comment:
      "Google Ads reklamlarımı güzel birşekilde kurguladı ve düzenledi, kendisi uygun fiyata yaptı tavsiye ederim.",
    date: "2026-04-20",
    source: "Armut",
  },
];

/** Admin'den eklenene kadar bos — LogoMarquee 3+ firma olunca gorunur */
export const mockReferenceCompanies: ReferenceCompanyDto[] = [];

export const mockVideoTestimonials: VideoTestimonialDto[] = [
  {
    id: "vid-1",
    name: "Deniz Aktaş",
    company: "UrbanWear",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "2:14",
    quote: "6 ayda online ciromuzu 4 katına çıkardık.",
  },
  {
    id: "vid-2",
    name: "Pınar Çelik",
    company: "GurmeSepeti",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "1:52",
    quote: "ROAS'ımız ilk çeyrekte 5'in üzerine çıktı.",
  },
  {
    id: "vid-3",
    name: "Emre Şahin",
    company: "FitLife",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "2:38",
    quote: "Üyelik başına maliyetimiz yarı yarıya düştü.",
  },
];

export const mockCaseStudies: CaseStudyDto[] = [
  {
    id: "cs-1",
    client: "ModaVitrin",
    industry: "E-ticaret / Moda",
    summary:
      "Performance Max ve dinamik remarketing kombinasyonuyla 4 ayda kârlı ölçeklendirme.",
    metrics: [
      { label: "Aylık Ciro", before: "50.000 ₺", after: "240.000 ₺" },
      { label: "ROAS", before: "1.8", after: "5.2" },
      { label: "Dönüşüm Oranı", before: "%1,2", after: "%3,4" },
    ],
    growth: "+380%",
    tags: ["Performance Max", "Remarketing", "E-ticaret"],
  },
  {
    id: "cs-2",
    client: "SağlıkClinic",
    industry: "Sağlık Hizmetleri",
    summary:
      "Arama ağı yeniden yapılandırması ile nitelikli randevu sayısında ciddi artış.",
    metrics: [
      { label: "Randevu / Ay", before: "45", after: "180" },
      { label: "Randevu Maliyeti", before: "320 ₺", after: "128 ₺" },
      { label: "ROAS", before: "2.1", after: "4.8" },
    ],
    growth: "+300%",
    tags: ["Arama Ağı", "Dönüşüm Takibi", "Yerel"],
  },
  {
    id: "cs-3",
    client: "TeknoParça",
    industry: "B2B / Teknoloji",
    summary:
      "Akıllı teklif stratejileri ve A/B testleriyle teklif başına maliyette düşüş.",
    metrics: [
      { label: "Aylık Talep", before: "120", after: "410" },
      { label: "Talep Maliyeti", before: "210 ₺", after: "95 ₺" },
      { label: "ROAS", before: "2.4", after: "6.1" },
    ],
    growth: "+241%",
    tags: ["B2B", "A/B Test", "Akıllı Teklif"],
  },
];
