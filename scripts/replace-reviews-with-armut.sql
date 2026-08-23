-- Canli DB: sahte Armut yorumlarini sil, gercek 6 yorumu ekle.
-- WebMSSQL / SSMS uzerinden calistirin. ONCE YEDEK ALIN.
-- Tablo: Reviews (Id, Author, Service, Rating, Comment, Date, Source, IsActive)

BEGIN TRANSACTION;

DELETE FROM Reviews;

INSERT INTO Reviews (Id, Author, Service, Rating, Comment, Date, Source, IsActive)
VALUES
(
    NEWID(),
    N'Semih S.',
    N'Google Ads Uzmanı',
    5,
    N'Hasan beyle ilk çalışmamız gerçekten kendi işi gibi ilgilendi, düzenli kontrol etti çok memnun kaldık. İnşallah daha da devam edeceğiz kendisi ile teşekkür ederim 😊',
    '2026-06-23',
    N'Armut',
    1
),
(
    NEWID(),
    N'Davut Ö.',
    N'Google Ads Uzmanı',
    5,
    N'Gebze de branda sektöründe hizmet veriyorum armuttan ulaştı hasan bey bana reklamları sorunsuz kurdu sonrasında işinin her daim peşinde durdu ne zaman ulaşmak istersem cevap verdi kendisine teşekkür ederim gönül rahatlığıyla tavsiye edebilirim size',
    '2026-06-02',
    N'Armut',
    1
),
(
    NEWID(),
    N'Yasin Ç.',
    N'Google Reklam Yönetimi',
    5,
    N'Alanında uzman ve ilgili kişi spam yiyen profilimi aktif etti işin takibini yaptı teşekkürler şiddetle tavsiye ederim',
    '2026-05-28',
    N'Armut',
    1
),
(
    NEWID(),
    N'Yasin Ö.',
    N'Google Ads Uzmanı',
    5,
    N'Gerçekten işini çok düzgün yapan biri. Süreç boyunca ilgisi çok iyiydi, sürekli bilgilendirme yaptı ve söylediği her şeyi eksiksiz yerine getirdi. Uğraşıyor, takip ediyor ve güven veriyor. Gönül rahatlığıyla çalışabilirsiniz 👍',
    '2026-04-27',
    N'Armut',
    1
),
(
    NEWID(),
    N'Münteha K.',
    N'Google Ads Danışmanlık',
    5,
    N'Gayet ilgili ve işinde özenli bir ads uzmanı tavsiye ederim üstelik haksız yorum kaldırma konusunda da çok başarılı',
    '2026-03-18',
    N'Armut',
    1
),
(
    NEWID(),
    N'Ayhan E.',
    N'Google Ads Uzmanı',
    5,
    N'Google Ads reklamlarımı güzel birşekilde kurguladı ve düzenledi, kendisi uygun fiyata yaptı tavsiye ederim.',
    '2026-04-20',
    N'Armut',
    1
);

COMMIT TRANSACTION;

-- Dogrulama:
-- SELECT Author, Date, Service, LEFT(Comment, 40) AS CommentPreview FROM Reviews ORDER BY Date DESC;
