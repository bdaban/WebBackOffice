## Backoffice Web - İş Planı (ispani)

### 1) Amaç ve Kapsam
- **Amaç**: Akaryakıt istasyonu/backoffice operasyonları için bir yönetim paneli: cariler, satışlar, tahsilatlar, vardiya ve tank verilerinin görselleştirilmesi, raporlanması.
- **Teknolojiler**: Nuxt 3, TypeScript, Tailwind CSS, Chart.js (nuxt e chart entegrasyonu), TypeORM (mevcut). Sunucu tarafında yalnızca yeni okuma API uçları yazılacak, `server/db` dizinindeki dosyalar değiştirilmeden kullanılacak.

### 2) Veri Modeli Özeti (Salt-okunur)
- **Cariler**: Cari kimlik, cari kodu/adı, iletişim, indirim, limit, ödeme şekli.
- **CariHareketler**: Cari bazlı fiş/satış hareketleri (tarih, yakıt, miktar, tutar, plaka vb.).
- **SaleDetails, VardiyaSaleDetails**: Pompa satış detayları; vardiya bazlı varyantı mevcuttur.
- **TahsilatTablosu**: Tahsilat kayıtları (tarih, tutar, ödeme şekli, kasa durumu).
- **TankDetails**: Tank zaman serisi (seviye, ürün, vardiya no).
- **OnlineSaleDetails**: Online satış detayları.
- **CreditCard**: Cari kart bilgileri (salt görüntüleme; hassas veri maskeleme gerekir).
- **Users, UsersRole**: Kullanıcı kimlik ve yetki tanımları.

### 3) Modüller ve Sayfalar
- **Kimlik/Yetki**: Basit oturum (ör. cookie tabanlı mock login) ve `UsersRole` ile görünürlük kontrolü.
- **Dashboard**: KPI kartları ve grafikler.
  - Günlük/haftalık toplam satış, miktar, ort. birim fiyat.
  - Ürün bazlı dağılım (pie/donut).
  - Trend grafik: son 30 gün tutar/miktar.
- **Cariler**: Liste, arama/filtre, detay sayfası.
  - Detay: temel bilgiler + son hareketler + limit/indirim.
- **Satışlar**: `SaleDetails`/`VardiyaSaleDetails` tablo + filtre (tarih, ürün, pompa, plaka) + grafik.
- **Tahsilatlar**: `TahsilatTablosu` tablo + ödeme şekli/karşı cari filtre + kasa durumu breakdown.
- **Tank İzleme**: `TankDetails` zaman serisi grafiği, vardiya numarası dilimi.

### 4) API Tasarımı (salt-okuma, server/api/)
- `GET /api/cariler?query=&page=&pageSize=`
- `GET /api/cariler/:id`
- `GET /api/cari-hareketler?cariId=&from=&to=&plate=`
- `GET /api/sales?from=&to=&fuelType=&pumpNr=` (SaleDetails)
- `GET /api/vardiya-sales?from=&to=&vardiyaNo=` (VardiyaSaleDetails)
- `GET /api/tahsilatlar?from=&to=&odemeSekli=&kasaDurumu=`
- `GET /api/tank?from=&to=&tankNo=`
- `GET /api/online-sales?from=&to=&plate=`
- `GET /api/metrics/summary?from=&to=` (dashboard KPI)

Notlar:
- Tüm uçlar `getDataSource()` ile repository üzerinden sorgulayacak.
- Girdi doğrulama ve sayfalama standart olacak.
- Kredi kartı alanları maskelemeli döner (XXXX-XXXX-XXXX-1234).

### 5) UI ve Bileşenler
- **Layout**: Üst navbar, sol sidebar; karanlık/açık tema toggle.
- **Form Bileşenleri**: Tarih aralığı seçici, arama input, select (yakit, pompa, ödeme şekli).
- **Tablolar**: Basit sıralama, responsive, sticky başlık.
- **Grafikler**: Chart.js için composable (`useCharts`) ve `BaseChart` bileşeni.
- **KPI Kartları**: Basit `StatCard` bileşeni (başlık, değer, değişim, ikon).

### 6) Kurulum ve Entegrasyonlar
- Tailwind CSS kurulumu ve `app/assets/css/main.css` entegrasyonu.
- Chart.js kurulumu, Nuxt plugin ile global kayıt.
- Nuxt runtime config ile DB env okuma hazır (mevcut `server/utils/runtime.ts`).

### 7) Yetkilendirme Stratejisi
- Basit login formu; kullanıcı adı ile giriş (demo). Parola doğrulaması gerçek ortamda dış sistemde/Hash kontrolü ile yapılmalı.
- `UsersRole` tablosundaki `Yetki` alanı ve `FormAdi`/`KontrolAdi` ile sayfa/buton görünürlüğü.

### 8) Teslim Aşamaları
- [x] Tailwind ve Chart entegrasyon (altyapı).
- [x] Layout + Navbar + Tema toggle.
- [x] Dashboard (KPI + grafikler, stub API).
- [x] Cariler listesi ve detayları.
- [x] Satış ve Tahsilat sayfaları.
- [ ] Tank ve Vardiya görünümleri.
- [ ] Yetki ve oturum akışı.
- [ ] Stil cilası, erişilebilirlik, performans.

### 9) Teknik Detaylar
- Sorgular MSSQL uyumlu; tarih aralıkları UTC varsayılır.
- Büyük tablolar için sayfalama ve indekslere uygun filtreler kullanılacak.
- API yanıtları: `{ data, pagination?, filtersUsed }` formatında.

### 10) Riskler ve Varsayımlar
- Büyük veri setlerinde grafiklerin performansı: downsample/aggregate.
- Kredi kartı bilgileri: sadece maskeleme ile gösterim.
- `server/db` değişmeyecek; ek ihtiyaç olursa view-benzeri uçlar oluşturulacak.

### 11) Başarı Kriterleri
- `server/db` untouched, tüm sayfalar yükleniyor, grafikler çalışıyor.
- Ana akışlar: Dashboard, Cariler, Satış, Tahsilat, Tank.
- Basit yetkilendirme ile kontroller görünürlük yönetimi.


