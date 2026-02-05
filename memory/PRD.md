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

### ✅ Bug Fixes - 10 Ocak 2025
- **Race Condition Düzeltildi:** `profileLoading` state eklendi
- **404 Hatası Düzeltildi:** `stripe_user_subscriptions` → `user_subscriptions`
- **Supabase SQL Script:** Performans ve güvenlik düzeltmeleri uygulandı

### ✅ Modern UI/UX Redesign - 2 Şubat 2025
- **Landing Page:** Tamamen yenilendi (HeroSection, DifferenceSection)
- **Dashboard Ana Sayfa:** Modern tasarım, animasyonlar, glassmorphism
- **Video Oluşturma Sayfası:** Yeni dropdown stilleri, modern kartlar
- **Sidebar:** Animasyonlu geçişler, aktif durumu göstergesi
- **Modallar:** Framer Motion animasyonları
- **Renk Paleti:** Neon cyan (#00f0ff), neon purple (#b066ff), neon pink (#ff0080)
- **Tasarım Dili:** Koyu tema, glassmorphism, gradient efektler

### ✅ Kritik Bug Fix - 4 Şubat 2025
- **process.env Hatası Düzeltildi:** Vite ortamında `process.env` yerine `import.meta.env` kullanıldı
- **Etkilenen Dosyalar:**
  - DifferenceSection.tsx - Video URL için env değişkeni düzeltildi
  - video-slider.tsx - Backend URL için env değişkeni düzeltildi
  - pricing.tsx - `plans` prop'u isteğe bağlı yapıldı, varsayılan planlar eklendi
- **Sonuç:** Landing page artık düzgün yükleniyor, React crash hatası giderildi

### ✅ Sosyal Giriş UI - 2 Şubat 2025
- Google ile giriş butonu (UI hazır)
- Apple ile giriş butonu (UI hazır)
- **NOT:** Supabase'de provider etkinleştirmesi BEKLEMEDE

## Bekleyen Görevler

### P0 - Video Oynatma Sorunu (Devam Ediyor)
- [ ] **Video Playback:** Tarayıcıda video yüklenmiyor (`net::ERR_ABORTED`)
  - Backend doğru çalışıyor (curl ile 200 OK, video/mp4)
  - Çözüm: Videoları Supabase Storage'a yüklemek (kullanıcı bucket oluşturmalı)

### P1 - Yüksek Öncelik
- [ ] **Google/Apple OAuth Yapılandırması** - Kullanıcının Supabase'de etkinleştirmesi gerekiyor
- [ ] Supabase Dashboard'dan performans/güvenlik uyarıları kontrol edilmeli (USER VERIFICATION)
- [ ] Video işleniyor durumu UI'da gösterimi iyileştirilmeli

### P2 - Orta Öncelik
- [ ] Dashboard.tsx refaktör (bileşenlere ayır)
- [ ] `stripe-config.ts` → `plan-config.ts` olarak yeniden adlandır
- [ ] Iyzico ödeme entegrasyonu (MOCKED)
- [ ] Eski dosyaları temizle (ComparisonTable.tsx, supabase_fixes.sql)

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
- `/app/frontend/src/hooks/useAuth.ts` - Auth ve admin durumu
- `/app/frontend/src/hooks/useSubscriptionAccess.ts` - İzin kontrolü
- `/app/design_guidelines.json` - Tasarım kuralları

## Admin Hesabı
- Email: beratyilmaz626@gmail.com
- Rol: Admin (is_admin: true)

## Test Durumu

### Son Test - 4 Şubat 2025
- **Rapor:** `/app/test_reports/iteration_1.json`
- **Frontend Success Rate:** 100%
- **Backend:** Test edilmedi (skip)
- **Kritik:** process.env hatası düzeltildi, uygulama düzgün çalışıyor

## Notlar
- Iyzico entegrasyonu henüz yapılmadı (MOCKED)
- Google/Apple OAuth UI hazır, Supabase yapılandırması bekliyor
- Tüm fiyatlar Türk Lirası (TL)
- Video işleme n8n webhook üzerinden yapılıyor
