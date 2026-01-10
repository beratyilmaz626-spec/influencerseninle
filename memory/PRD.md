# InfluencerSeninle - PRD (Product Requirements Document)

## Proje Özeti
AI destekli video oluşturma platformu. Kullanıcılar fotoğraf yükleyerek, stil ve sektör seçerek otomatik UGC (User Generated Content) videoları oluşturabiliyor.

## Teknoloji Stack'i
- **Frontend:** React + TypeScript + Vite + TailwindCSS
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

### ✅ Video Oluşturma Akışı
- Fotoğraf yükleme
- Cinsiyet, yaş, mekan, sektör seçimi
- Format seçimi (Yatay/Dikey)
- Konuşma metni (Otomatik/Özel/Yok)
- Video stili seçimi
- n8n webhook entegrasyonu

### ✅ Bug Fixes - 10 Ocak 2025
- **Race Condition Düzeltildi:** `profileLoading` state eklendi, UI artık admin durumu yüklenmeden render etmiyor
- **404 Hatası Düzeltildi:** `stripe_user_subscriptions` → `user_subscriptions` olarak değiştirildi
- **Supabase SQL Script:** Performans ve güvenlik düzeltmeleri için kapsamlı SQL script oluşturuldu

## Bekleyen Görevler

### P1 - Yüksek Öncelik
- [ ] Supabase SQL script'ini çalıştır (performans + güvenlik)
- [ ] HaveIBeenPwned şifre kontrolünü aktifleştir (Supabase Dashboard)
- [ ] Video işleniyor durumu UI'da gösterimi

### P2 - Orta Öncelik
- [ ] Dashboard.tsx refaktör (bileşenlere ayır)
- [ ] `stripe-config.ts` → `plan-config.ts` olarak yeniden adlandır
- [ ] Iyzico ödeme entegrasyonu (MOCKED)

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
- `/app/frontend/src/hooks/useAuth.ts` - Auth ve admin durumu
- `/app/frontend/src/hooks/useSubscriptionAccess.ts` - İzin kontrolü
- `/app/frontend/src/components/Dashboard.tsx` - Ana dashboard
- `/app/supabase_fixes.sql` - Supabase düzeltme script'i

## Admin Hesabı
- Email: beratyilmaz626@gmail.com
- Rol: Admin (is_admin: true)

## Notlar
- Iyzico entegrasyonu henüz yapılmadı (MOCKED)
- Tüm fiyatlar Türk Lirası (TL)
- Video işleme n8n webhook üzerinden yapılıyor
