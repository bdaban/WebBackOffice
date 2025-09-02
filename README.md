# Backoffice Web (Masaüstünden Web’e Geçiş)

Bu proje, yıllardır masaüstü olarak kullanılan backoffice uygulamasının modern web teknolojileri ile yeniden geliştirilen sürümüdür. Amaç; mevcut SQL Server veritabanı ve iş akışlarını koruyarak, yönetim panelini Nuxt tabanlı, hızlı ve kullanıcı dostu bir web uygulamasına dönüştürmektir.

## Özellikler

- Dashboard: KPI kartları, satış trendi, yakıt dağılımı
- Cariler: Liste, arama, detay, hesap ekstresi ve özet kartlar
- Raporlar:
  - Vardiya performansı (toplam ciro, pompa kırılımı)
  - Tank analizi (tank özet tablosu ve pie dağılımı)
  - Ürün (yakıt) trendi
  - Ödeme yöntemi trendi
  - Plaka bazlı tüketim (top plakalar ve dağılım)
  - Isı haritası (saat/gün bazlı satış yoğunluğu)
  - Loyalty/Filo özeti
  - Cari limit/iskonto kullanımı (doluluk histogramı)
- Basit oturum (login/logout) ve sayfa koruması
- Tailwind CSS ile modern UI, ECharts ile interaktif grafikler
- MSSQL’e TypeORM ile bağlanan salt-okuma API uçları
- Hot-reload ile hızlı geliştirme

## Mimarî

- Framework: Nuxt 3 + Nitro
- UI: Tailwind CSS
- Grafikler: nuxt-echarts / vue-echarts (ECharts)
- ORM: TypeORM (yalnızca sorgu/okuma)
- DB: Microsoft SQL Server (MSSQL)
- Server routes: `/server/api/*`

Not: `server/db/*` altındaki entity ve kaynak dosyaları mevcut yapıyı yansıtır ve değiştirilmemiştir. API tarafında metadata sorunlarını azaltmak için çoğu sorgu `createQueryBuilder().from('dbo.Table','alias')` ile yazılmıştır.

## Başlangıç

1) Depoyu klonla
```bash
git clone <repo-url>
cd backofficeweb
```

2) Bağımlılıkları yükle
```bash
npm install
```

3) Ortam değişkenlerini ayarla
`.env` dosyası oluştur:
```bash
# MSSQL
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_DATABASE=YourDbName

# Nuxt
NITRO_PORT=3000
```

4) Geliştirme sunucusunu başlat
```bash
npm run dev
```
- Local: `http://localhost:3000`

5) Giriş (Demo)
- Login sayfası: `/login`
- Kullanıcı: veritabanındaki `dbo.Users` tablosunda kayıtlı kullanıcı adı/parola ile giriş yapılır (örnek: `KullaniciAdi` ve `Parola` alanları).
- Cookie tabanlı oturum kullanılır.

## Üretim (Build/Deploy)

1) Build
```bash
npm run build
```
2) Start
```bash
npm run start
```
- Node.js 18+ tavsiye edilir.
- Üretimde `.env` dosyasını aynı şekilde sağlayın.
- Reverse proxy (Nginx) arkasında çalıştırırken `--host`/`PORT` yapılandırmasına dikkat edin.

## Önemli Uyarılar

- Veriler salt-okuma ile çekilir; `DELETE/UPDATE` yoktur.
- ECharts uyarıları (DOM 0 width/height) için grafikler yalnızca kapsayıcı boyutu > 0 olduğunda mount edilir (ClientOnly, Intersection/ResizeObserver ve guard’lar eklendi).
- MSSQL tarih aralıkları performans için `>= :from AND < DATEADD(day, 1, :to)` şeklinde yazılmıştır.
- Bazı nvarchar sütunlar için `TRY_CAST` kullanılmıştır (örn. tank raporu).

## Proje Yapısı (Seçmeler)

```
app/
  layouts/default.vue         # Sidebar + header
  pages/                      # Sayfalar (dashboard, cariler, raporlar)
  components/StatCard.vue     # KPI kartları
  plugins/echarts.client.ts   # ECharts bileşenleri
  middleware/auth.global.ts   # Giriş kontrolü
  composables/useAuth.ts      # Login/logout/me
server/
  api/                        # Salt-okuma API uçları
  db/                         # Entity’ler (değiştirilmedi)
  utils/runtime.ts            # DB runtime config
```

## SSS

- Masaüstünden web’e geçişte ne değişti?
  - UI tamamen web tabanlı; grafikler, responsive tasarım ve hızlı gezinme eklendi.
  - Veritabanı ve iş akışları korunarak, raporların web üzerinden erişilebilir olması sağlandı.

- Neden TypeORM ile `from('dbo.Table')` kullanılıyor?
  - Nuxt hot-reload ile Class metadata senkronizasyonu sorunları yaşanmaması için. Bu yaklaşım “No metadata” hatalarını önler.

- Raporlar menüsü nerede?
  - Sol sidebar’da “Raporlar” altında tüm linkler mevcut.

## Katkı

- Issue açabilir, PR gönderebilirsiniz.
- Kod stilinde mevcut format korunur; Tailwind yardımcı sınıflar ve ECharts seçenekleri proje genelindeki örneklerle uyumlu tutulur.

## Lisans

- Kurum içi kullanım (private). Dış paylaşımlarda lisans koşullarını kurum politikalarına göre güncelleyin.
