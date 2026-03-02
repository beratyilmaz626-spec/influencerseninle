// Aylık Abonelik Paketleri Konfigürasyonu
// KREDİ BAZLI SİSTEM - Her video 100 kredi
// Ödeme: USD bazlı

export type PlanId = 'starter' | 'professional' | 'enterprise';
export type FeatureId = 
  | 'hd_video'
  | 'no_watermark'
  | 'basic_templates'
  | 'premium_templates'
  | 'custom_templates'
  | 'email_support'
  | 'priority_support'
  | 'dedicated_support'
  | 'api_access'
  | 'advanced_api'
  | 'white_label'
  | 'video_15sec';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  nameEn: string;
  description: string;
  priceMonthly: number;      // USD fiyat
  currency: string;
  stripePriceId: string;
  monthlyCredits: number;    // Aylık kredi miktarı
  monthlyVideoLimit: number; // Video limiti (kredi/100)
  maxVideoDuration: number;  // Saniye cinsinden video süresi
  features: FeatureId[];
  featureDescriptions: string[]; // Görüntülenecek özellikler
  isPopular?: boolean;
}

// Video başına kredi maliyeti - SABİT
export const VIDEO_CREDIT_COST = 100;

// Yeni kullanıcı hediye kredisi
export const NEW_USER_BONUS_CREDITS = 200;

// Price ID'leri - AYLIK ABONELİK
export const IYZICO_PRICE_IDS = {
  starter: 'price_starter_monthly',
  professional: 'price_professional_monthly',
  enterprise: 'price_enterprise_monthly',
} as const;

// Legacy Stripe Price ID'leri (geriye uyumluluk için)
export const STRIPE_PRICE_IDS = IYZICO_PRICE_IDS;

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: 'Başlangıç Paketi',
    nameEn: 'Starter Package',
    description: '2000 kredi - 20 adet HD kalite ve filigransız video üretin',
    priceMonthly: 9.90,
    currency: 'USD',
    stripePriceId: IYZICO_PRICE_IDS.starter,
    monthlyCredits: 2000,
    monthlyVideoLimit: 20,
    maxVideoDuration: 15,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'email_support',
      'video_15sec',
    ],
    featureDescriptions: [
      '20 adet HD kalite video',
      'Filigransız videolar',
      'Temel şablonlar',
      'E-posta desteği'
    ],
    isPopular: false,
  },
  professional: {
    id: 'professional',
    name: 'Profesyonel Paketi',
    nameEn: 'Professional Package',
    description: '4500 kredi - 45 adet HD kalite ve filigransız video üretin',
    priceMonthly: 19.90,
    currency: 'USD',
    stripePriceId: IYZICO_PRICE_IDS.professional,
    monthlyCredits: 4500,
    monthlyVideoLimit: 45,
    maxVideoDuration: 15,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'premium_templates',
      'priority_support',
      'api_access',
      'video_15sec',
    ],
    featureDescriptions: [
      '45 adet HD kalite video',
      'Filigransız videolar',
      'Premium şablonlar',
      'Öncelikli destek',
      'API erişimi'
    ],
    isPopular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'İşletme Paketi',
    nameEn: 'Business Package',
    description: '10000 kredi - 100 adet HD kalite ve filigransız video üretin',
    priceMonthly: 39.90,
    currency: 'USD',
    stripePriceId: IYZICO_PRICE_IDS.enterprise,
    monthlyCredits: 10000,
    monthlyVideoLimit: 100,
    maxVideoDuration: 15,
    features: [
      'hd_video',
      'no_watermark',
      'custom_templates',
      'dedicated_support',
      'api_access',
      'advanced_api',
      'white_label',
      'video_15sec',
    ],
    featureDescriptions: [
      '100 adet HD kalite video',
      'Filigransız videolar',
      'Özel şablonlar',
      'Özel destek',
      'Gelişmiş API',
      'Beyaz etiket seçeneği'
    ],
    isPopular: false,
  },
};

// Özellik Açıklamaları
export const FEATURE_LABELS: Record<FeatureId, { name: string; description: string }> = {
  hd_video: {
    name: 'HD kalite video',
    description: 'Yüksek kaliteli HD video dışa aktarma',
  },
  no_watermark: {
    name: 'Filigransız videolar',
    description: 'Videolarda filigran olmadan dışa aktarma',
  },
  basic_templates: {
    name: 'Temel şablonlar',
    description: 'Temel video şablonlarına erişim',
  },
  premium_templates: {
    name: 'Premium şablonlar',
    description: 'Tüm premium video şablonlarına erişim',
  },
  custom_templates: {
    name: 'Özel şablonlar',
    description: 'Özelleştirilebilir video şablonları',
  },
  email_support: {
    name: 'E-posta desteği',
    description: 'E-posta ile teknik destek',
  },
  priority_support: {
    name: 'Öncelikli destek',
    description: 'Öncelikli müşteri desteği',
  },
  dedicated_support: {
    name: 'Özel destek',
    description: 'Özel müşteri temsilcisi',
  },
  api_access: {
    name: 'API erişimi',
    description: 'REST API erişimi',
  },
  advanced_api: {
    name: 'Gelişmiş API',
    description: 'Gelişmiş API özellikleri ve webhook desteği',
  },
  white_label: {
    name: 'Beyaz Etiket',
    description: 'Kendi markanızla kullanım',
  },
  video_10sec: {
    name: '10 Saniye Video',
    description: 'Maksimum 10 saniyelik video oluşturma',
  },
  video_15sec: {
    name: '15 Saniye Video',
    description: 'Maksimum 15 saniyelik video oluşturma',
  },
};

// Yardımcı fonksiyonlar
export const getPlanById = (planId: PlanId): SubscriptionPlan => {
  return SUBSCRIPTION_PLANS[planId];
};

export const getPlanByStripePriceId = (priceId: string): SubscriptionPlan | undefined => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.stripePriceId === priceId);
};

export const hasFeature = (planId: PlanId, featureId: FeatureId): boolean => {
  const plan = SUBSCRIPTION_PLANS[planId];
  return plan?.features.includes(featureId) ?? false;
};

export const getMonthlyVideoLimit = (planId: PlanId): number => {
  return SUBSCRIPTION_PLANS[planId]?.monthlyVideoLimit ?? 0;
};

export const getMaxVideoDuration = (planId: PlanId): number => {
  return SUBSCRIPTION_PLANS[planId]?.maxVideoDuration ?? 15; // Default 15 saniye
};

export const getAllPlans = (): SubscriptionPlan[] => {
  return Object.values(SUBSCRIPTION_PLANS);
};

// TL formatı için yardımcı fonksiyon
export const formatPriceTRY = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Kredi bazlı yardımcı fonksiyonlar
export const getMonthlyCredits = (planId: PlanId): number => {
  return SUBSCRIPTION_PLANS[planId]?.monthlyCredits ?? 0;
};

export const calculateVideosFromCredits = (credits: number): number => {
  return Math.floor(credits / VIDEO_CREDIT_COST);
};

export const calculateCreditsNeeded = (videoCount: number): number => {
  return videoCount * VIDEO_CREDIT_COST;
};

// Yeni kullanıcı için başlangıç kredisi (2 video hakkı)
export const getNewUserCredits = (): number => {
  return NEW_USER_BONUS_CREDITS;
};
