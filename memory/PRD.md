# InfluencerSeninle - PRD (Product Requirements Document)

## Proje Özeti
AI destekli video oluşturma platformu. Kullanıcılar fotoğraf yükleyerek, stil ve sektör seçerek otomatik UGC (User Generated Content) videoları oluşturabiliyor.

## Teknoloji Stack'i
- **Frontend:** React + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Video İşleme:** n8n webhook entegrasyonu
- **Ödeme:** Iyzico (henüz entegre edilmedi - MOCKED)

## Tamamlanan Özellikler

### ✅ Major Update - 12 Şubat 2026
- **DifferenceSection İyileştirmesi:**
  - Ruj görselini sol tarafa (Before) ekledik
  - ugc_video_2.mp4 ile video güncellendi
  - object-top ile görsel kadrajı düzeltildi
- **Neden Biz Bölümü Genişletildi:**
  - Her karşılaştırma kartına 7 madde eklendi
  - 4 istatistik metriği eklendi (%90, 10x, %300, 24/7)
- **Sektörler Bölümü Genişletildi:**
  - 6 sektörden 12 sektöre çıkartıldı
  - "+50 farklı sektörde hizmet" badge eklendi
- **Footer Yeniden Tasarlandı:**
  - 4 sütun: Marka, Hızlı Linkler, Yasal, İletişim
  - Sosyal medya ikonları eklendi
- **Yasal Sayfalar Eklendi:**
  - Gizlilik Politikası (/gizlilik-politikasi)
  - Kullanım Şartları (/kullanim-sartlari)
  - Çerez Politikası (/cerez-politikasi)
  - KVKK Aydınlatma Metni (/kvkk)

### ✅ Logo ve Tasarım - 11 Şubat 2026
- Yeni neon play butonu logosu eklendi
- Logo boyutu büyütüldü (192x192px)
- Header scroll ile kaybolacak şekilde ayarlandı
- Logo animasyonu (float) ve glow efekti eklendi
- Header ve hero section arka planları birleştirildi

### ✅ Google OAuth Entegrasyonu - 9 Şubat 2026
- Supabase signInWithOAuth entegrasyonu yapıldı
- Google ve Apple login butonları eklendi
- Loading state ve hata yönetimi eklendi
- **Not:** Kullanıcının Google Cloud Console'da redirect URI ayarlaması gerekiyor

### ✅ Jeton (Credit) Sistemi - 10 Ocak 2025
- 1 video = 200 jeton
- Yeni kullanıcılara otomatik 200 jeton hediye
- Admin kullanıcılar sınırsız video hakkı (999)
- Hediye jetonlu kullanıcılar abonelik olmadan video oluşturabilir

### ✅ Admin Paneli
- Kullanıcı yönetimi
- Hediye token verme
- Video stilleri yönetimi
- Slider video yönetimi
- Veritabanı bakımı (RLS & Indexes)

### ✅ Video Oluşturma Akışı
- Fotoğraf yükleme
- Cinsiyet, yaş, mekan, sektör seçimi
- Format seçimi (Yatay/Dikey)
- Konuşma metni (Otomatik/Özel/Yok)
- Video stili seçimi
- n8n webhook entegrasyonu

### ✅ Modern UI/UX Redesign - 2 Şubat 2025
- **Landing Page:** Tamamen yenilendi (HeroSection, DifferenceSection)
- **Dashboard Ana Sayfa:** Modern tasarım, animasyonlar
- **Video Oluşturma Sayfası:** Yeni dropdown stilleri, modern kartlar
- **Sidebar:** Animasyonlu geçişler, aktif durumu göstergesi
- **Renk Paleti:** Neon cyan (#00f0ff), neon purple (#b066ff), neon pink (#ff0080)
- **Tasarım Dili:** Koyu tema, gradient efektler

### ✅ Kritik Bug Fix - 4 Şubat 2025
- **process.env Hatası Düzeltildi:** Vite ortamında `process.env` yerine `import.meta.env` kullanıldı
- **Etkilenen Dosyalar:** DifferenceSection.tsx, video-slider.tsx, pricing.tsx
- **Sonuç:** Landing page artık düzgün yükleniyor

### ✅ Sosyal Giriş UI - 2 Şubat 2025
- Google ile giriş butonu (UI hazır)
- Apple ile giriş butonu (UI hazır)
- **NOT:** Supabase'de provider etkinleştirmesi BEKLEMEDE

## Bekleyen Görevler

### ✅ P0 - KRİTİK BUG FIX TAMAMLANDI - 1 Mart 2026
- [x] **Sonsuz Render Döngüsü & Otomatik Çıkış Sorunu KESİN ÇÖZÜLDÜ**
  - Test: **3 DAKİKA** (180 saniye) boyunca dashboard stabil kaldı ✅

### ✅ KREDİ SİSTEMİ & FİYATLANDIRMA GÜNCELLEMESİ - 2 Mart 2026
- [x] **Video Maliyeti 100 Kredi olarak güncellendi** (önceki: 200)
- [x] **Yeni kullanıcı hediyesi: 200 kredi** (2 video hakkı)
- [x] **Paketler USD bazlı yeni fiyatlara güncellendi:**
  - Başlangıç: $9.90 /ay • 2.000 Kredi • 20 Video • 15 sn
  - Profesyonel: $19.90 /ay • 4.500 Kredi • 45 Video • 15 sn
  - İşletme: $39.90 /ay • 10.000 Kredi • 100 Video • 15 sn
- [x] **Frontend güncellemeleri:**
  - Video oluşturma sayfasında "Video Maliyeti: 100 Kredi" ve bakiye gösterimi
  - Admin için "Sınırsız" bakiye gösterimi
  - Plan kartları USD formatında ($X.XX /ay) - ikon olmadan
  - Landing page ve Dashboard Planlar sayfası fiyatları senkronize
- [x] **Instagram linki footer'a eklendi** (influencerseninle)

### P0 - Video Oynatma Sorunu (Devam Ediyor)
- [ ] **Video Playback:** Tarayıcıda video yüklenmiyor (`net::ERR_ABORTED`)
  - Backend doğru çalışıyor (curl ile 200 OK, video/mp4)
  - Çözüm: Videoları Supabase Storage'a yüklemek (kullanıcı bucket oluşturmalı)

### P1 - Yüksek Öncelik
- [ ] **Video İndirme Kalitesi** - Düzeltme yapıldı, kullanıcı doğrulaması bekliyor
- [ ] **Google/Apple OAuth Yapılandırması** - Kullanıcının Supabase'de etkinleştirmesi gerekiyor
- [ ] **Arzu kullanıcısı hediye kredi sorunu** - Gift credit logic test edilmeli
- [ ] Supabase Dashboard'dan performans/güvenlik uyarıları kontrol edilmeli (USER VERIFICATION)
- [ ] Video işleniyor durumu UI'da gösterimi iyileştirilmeli

### P2 - Orta Öncelik
- [ ] Dashboard.tsx refaktör (bileşenlere ayır - 2300+ satır!)
- [ ] `stripe-config.ts` → `plan-config.ts` olarak yeniden adlandır
- [ ] Iyzico ödeme entegrasyonu (MOCKED)
- [ ] Eski dosyaları temizle (ComparisonTable.tsx, supabase_fixes.sql)
- [ ] **Vercel Deployment** - Ortam değişkenleri kullanıcı tarafından eklenmeli

### P3 - Düşük Öncelik
- [ ] Tüm mevcut kullanıcıların kredilerini 200x çarp (bulk update)
- [ ] Jeton sistemi tam test

## Veritabanı Şeması

### users
- id (UUID, PK)
- email (text)
- full_name (text)
- is_admin (boolean)
- user_credits_points (integer) - Jeton bakiyesi
- created_at, updated_at

### videos
- id (UUID, PK)
- user_id (UUID, FK)
- name (text)
- description (text)
- video_url (text)
- thumbnail_url (text)
- status ('completed' | 'processing' | 'failed')
- views (integer)
- created_at, updated_at

### video_styles
- id (UUID, PK)
- style_id (text)
- name (text)
- image (text)
- prompt (text)
- is_active (boolean)
- order_index (integer)

## Önemli Dosyalar
- `/app/frontend/src/components/Dashboard.tsx` - Ana dashboard (YENİ TASARIM)
- `/app/frontend/src/components/LandingPage.tsx` - Landing page (YENİ TASARIM)
- `/app/frontend/src/components/HeroSection.tsx` - Hero bölümü
- `/app/frontend/src/components/DifferenceSection.tsx` - Karşılaştırma bölümü
- `/app/frontend/src/components/AuthModal.tsx` - Giriş modal (Google/Apple UI)
- `/app/frontend/src/hooks/useAuth.ts` - Auth ve admin durumu (28 Şubat 2026 güncellendi)
- `/app/frontend/src/hooks/useSubscriptionAccess.ts` - İzin kontrolü (28 Şubat 2026 yeniden yazıldı)
- `/app/frontend/src/App.tsx` - Ana app (28 Şubat 2026 auto-redirect eklendi)
- `/app/design_guidelines.json` - Tasarım kuralları

## Admin Hesabı
- Email: beratyilmaz626@gmail.com
- Rol: Admin (is_admin: true)

## Test Durumu

### Son Test - 2 Mart 2026 (BAŞARILI) ✅
- **Testing Agent ile Frontend Testi:** %100 başarı oranı
- **Test Edilen Özellikler:**
  1. Landing page yükleme ✅
  2. Fiyat formatı ($X.XX /ay) Landing page ✅
  3. Fiyat formatı ($X.XX /ay) Planlar sayfası ✅
  4. Instagram linki (footer) ✅
  5. Admin girişi ✅
  6. Dashboard yükleme ✅
  7. Navigasyon (Ana Sayfa, Videolarım, Video Üret, Planlar, Ayarlar) ✅
  8. Kredi gösterimi ✅
  9. Dashboard stabilitesi (2 dakika bekleme) ✅
  10. Çıkış işlemi ✅
- **Kritik Bug Fix:** Sayfa yenileme/otomatik çıkış sorunu ÇÖZÜLDÜ ✅

### Önceki Test - 1 Mart 2026 (BAŞARILI)
- **Kritik Bug Fix:** Sonsuz render döngüsü ve otomatik logout sorunu KESİN ÇÖZÜLDÜ ✅
- **Test Yöntemi:** Playwright ile **180 saniye (3 dakika)** stabilite testi
- **Sonuç:** Dashboard 3 dakika boyunca stabil kaldı, hiç logout olmadı
- **Videolar:** 6 demo video başarıyla yüklendi ve gösteriliyor
- **Değiştirilen Dosyalar:** 
  - `useAuth.ts` - Singleton pattern, listener kaldırıldı
  - `useVideos.ts` - Global cache eklendi
  - `useSubscription.ts` - Global cache eklendi
  - `useSubscriptionAccess.ts` - Tamamen yeniden yazıldı
  - `supabase.ts` - autoRefreshToken: false, realtime kapatıldı
  - `main.tsx` - StrictMode kaldırıldı

## Notlar
- Iyzico entegrasyonu henüz yapılmadı (MOCKED)
- Google/Apple OAuth UI hazır, Supabase yapılandırması bekliyor
- Tüm fiyatlar Türk Lirası (TL)
- Video işleme n8n webhook üzerinden yapılıyor
