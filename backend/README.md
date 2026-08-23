# Odak Ads Reklam — ASP.NET Core 9 Web API

Next.js 15 frontend ile **birebir uyumlu** backend. Public içerik uçları frontend'in
`lib/api/types.ts` sözleşmesini aynen döndürür; admin paneli için JWT korumalı CRUD sağlar.

## Teknoloji

ASP.NET Core 9 · EF Core 9 (SQL Server) · MediatR (CQRS) · FluentValidation · Serilog ·
JWT + Refresh Token (rotation) · Swagger. Clean Architecture (Domain / Application /
Infrastructure / Persistence / API). Repository/UoW yok — DbContext doğrudan `IAppDbContext`.

## Çalıştırma

```bash
cd backend
dotnet restore
dotnet ef database update -p src/Persistence -s src/API   # LocalDB'ye migration uygula
dotnet run --project src/API --urls "http://localhost:5080"
```

Uygulama açılışta migration'ı uygular ve seed verisini ekler. Swagger yalnızca **Development** ortamında açılır: `http://localhost:5085/swagger`.

> Bağlantı dizesi `appsettings.json → ConnectionStrings:DefaultConnection` (varsayılan:
> `(localdb)\MSSQLLocalDB`, veritabanı `HasanHabibSeydaDb`). Farklı SQL Server için burayı değiştirin.

## Varsayılan admin

- E-posta: `admin@odakadsreklam.com`
- Parola: `Admin123!` (PBKDF2/HMACSHA512 ile hash'lenir)

## Public Uçlar (frontend ile birebir, `ApiResponse<T[]>`)

| Method | Yol | Döner |
| --- | --- | --- |
| GET | `/api/services` | `ServiceDto[]` |
| GET | `/api/stats` | `StatDto[]` |
| GET | `/api/process-steps` | `ProcessStepDto[]` |
| GET | `/api/values` | `ValueDto[]` |
| GET | `/api/testimonials` | `TestimonialDto[]` |
| GET | `/api/reviews` | `ReviewDto[]` |
| GET | `/api/video-testimonials` | `VideoTestimonialDto[]` |
| GET | `/api/case-studies` | `CaseStudyDto[]` |
| GET | `/api/site-settings` | `SiteSettingsDto` |
| POST | `/api/contact` | `ContactResponseDto` (DB'ye kaydeder + Resend e-posta) |

Public list'ler yalnızca `IsActive=true` kayıtları, uygun sıralamayla **düz dizi** döndürür.

## Admin Uçları (JWT — `Authorize(Roles="Admin")`)

- **Auth:** `POST /api/admin/auth/login` · `/refresh` (rotation) · `/logout`
- **CRUD** (`GET` paged + `GET /{id}` + `POST` + `PUT /{id}` + `DELETE /{id}`):
  `/api/admin/services` · `/api/admin/testimonials` · `/api/admin/video-testimonials` ·
  `/api/admin/case-studies`
- **İletişim:** `GET /api/admin/contact-requests` (+`/{id}`) · `PUT /{id}/read` · `DELETE /{id}`
- **Site ayarları:** `GET` / `PUT /api/admin/site-settings`
- **Dashboard:** `GET /api/admin/dashboard`

Admin list'leri `ApiResponse<PagedResult<T>>` döner ve sorgu parametrelerini destekler:
`?page=1&pageSize=10&search=...&sortBy=...&sortDirection=desc`.

## Yapılandırma (appsettings)

- `ConnectionStrings:DefaultConnection` — SQL Server
- `Jwt:{Issuer,Audience,Key,AccessTokenMinutes,RefreshTokenDays}` — **prod'da `Key`'i değiştirin**
- `Resend:{ApiKey,From,To}` — `ApiKey` boşsa e-posta simüle edilir (loglanır)
- `Cors:Origins` — geliştirmede localhost origin'leri; production'da boş bırakılabilir (tek-host mimari)
- `Database:AutoMigrate` — açılışta EF migration (production: genelde `true`)
- `Database:SeedOnStartup` — boş tablolara seed (production: ilk kurulumdan sonra `false`)
- `AllowedHosts` — production'da domain kısıtlaması
- `Serilog` — Console + `logs/log-.txt` (günlük rolling)

## Production sertleştirme

Tek-host deploy (Next.js static export → `wwwroot/` + API aynı process):

1. Şablonu kopyalayın:
   ```bash
   cp src/API/appsettings.Production.json.example src/API/appsettings.Production.json
   ```
2. `appsettings.Production.json` içinde doldurun:
   - SQL Server bağlantı dizesi
   - `Jwt:Key` — en az 64 karakter, rastgele (dev key'i kullanmayın)
   - `Resend:ApiKey` — Resend dashboard
   - `AllowedHosts` — `odakadsreklam.com;www.odakadsreklam.com`
3. Ortam değişkeni: `ASPNETCORE_ENVIRONMENT=Production`
4. Publish:
   ```bash
   dotnet publish src/API/HasanHabibSeyda.API.csproj -c Release -o ./publish
   ```
   (Frontend build otomatik çalışır; atlamak için `-p:SkipFrontendBuild=true`)

**Production pipeline davranışı:**

| Özellik | Development | Production |
| --- | --- | --- |
| Swagger UI | Açık | Kapalı |
| HTTPS yönlendirme + HSTS | Kapalı | Açık |
| Forwarded headers (Cloudflare) | Kapalı | Açık |
| CORS | `localhost:3000/3005` | Boş (same-origin; gerekirse origin ekleyin) |

**Cloudflare:** SSL/TLS modu **Full (strict)** önerilir. Origin'e HTTP gelir; `X-Forwarded-Proto` ile HTTPS algılanır.

> `appsettings.Production.json` gitignore'da — secret'lar repoya girmez.

## Migration ve seed bayrakları

| Ayar | Development | Production (örnek) |
| --- | --- | --- |
| `Database:AutoMigrate` | `true` | `true` |
| `Database:SeedOnStartup` | `true` | `false` (ilk kurulumdan sonra) |

Seed idempotent'tir — yalnızca boş tablolar doldurulur. Production'da ilk deploy sonrası `SeedOnStartup: false` yapın.

Loglarda `Startup.Database` kaynaklı migration/seed mesajlarını kontrol edin.

## Frontend bağlantısı

**Geliştirme** (ayrı Next.js dev server): `.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:5085`

**Production** (tek host): `NEXT_PUBLIC_API_BASE_URL` boş bırakılır — istekler relatif `/api/...` yoluna gider.
