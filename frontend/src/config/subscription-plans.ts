// Aylık Abonelik Paketleri Konfigürasyonu
// SADECE AYLIK ABONELİK - TEK SEFERLİK VEYA YILLIK ÖDEME YOK
// Ödeme: İyzico (TL bazlı)

export type PlanId = 'starter' | 'professional' | 'enterprise';
export type FeatureId = 
  | 'hd_video'
  | 'no_watermark'
  | 'basic_templates'
  | 'premium_templates'
  | 'email_support'
  | 'priority_support'
  | 'dedicated_support'
  | 'api_access'
  | 'advanced_api'
  | 'white_label'
  | 'video_10sec'
  | 'video_15sec';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  nameEn: string;
  description: string;
  priceMonthly: number;      // TL fiyat
  priceMonthlyUSD?: number;  // USD karşılığı (referans)
  currency: string;
  stripePriceId: string;     // İyzico için de kullanılabilir
  monthlyVideoLimit: number;
  maxVideoDuration: number;  // Saniye cinsinden video süresi
  features: FeatureId[];
  isPopular?: boolean;
}

// İyzico Price ID'leri - AYLIK ABONELİK
export const IYZICO_PRICE_IDS = {
  starter: 'iyzico_starter_monthly',
  professional: 'iyzico_professional_monthly',
  enterprise: 'iyzico_enterprise_monthly',
} as const;

// Legacy Stripe Price ID'leri (geriye uyumluluk için)
export const STRIPE_PRICE_IDS = IYZICO_PRICE_IDS;

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    nameEn: 'Starter',
    description: '10 saniyelik videolar ile başlangıç paketi',
    priceMonthly: 949,
    priceMonthlyUSD: 27,
    currency: 'TRY',
    stripePriceId: IYZICO_PRICE_IDS.starter,
    monthlyVideoLimit: 20,
    maxVideoDuration: 10,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'email_support',
      'video_10sec',
    ],
    isPopular: false,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    nameEn: 'Professional',
    description: '15 saniyelik videolar ile profesyonel paket',
    priceMonthly: 3799,
    priceMonthlyUSD: 108,
    currency: 'TRY',
    stripePriceId: IYZICO_PRICE_IDS.professional,
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
    isPopular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Business',
    nameEn: 'Business',
    description: '15 saniyelik videolar ile kurumsal paket',
    priceMonthly: 8549,
    priceMonthlyUSD: 244,
    currency: 'TRY',
    stripePriceId: IYZICO_PRICE_IDS.enterprise,
    monthlyVideoLimit: 100,
    maxVideoDuration: 15,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'premium_templates',
      'dedicated_support',
      'api_access',
      'advanced_api',
      'white_label',
      'video_15sec',
    ],
    isPopular: false,
  },
};

// Özellik Açıklamaları
export const FEATURE_LABELS: Record<FeatureId, { name: string; description: string }> = {
  hd_video: {
    name: 'HD 1080p Video',
    description: 'Yüksek kaliteli 1080p video dışa aktarma',
  },
  no_watermark: {
    name: 'Filigransız Video',
    description: 'Videolarda filigran olmadan dışa aktarma',
  },
  basic_templates: {
    name: 'Temel Şablonlar',
    description: 'Temel video şablonlarına erişim',
  },
  premium_templates: {
    name: 'Premium Şablonlar',
    description: 'Tüm premium video şablonlarına erişim',
  },
  email_support: {
    name: 'E-posta Desteği',
    description: 'E-posta ile teknik destek',
  },
  priority_support: {
    name: 'Öncelikli Destek',
    description: 'Öncelikli müşteri desteği',
  },
  dedicated_support: {
    name: 'Özel Destek',
    description: 'Özel müşteri temsilcisi',
  },
  api_access: {
    name: 'API Erişimi',
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
  return SUBSCRIPTION_PLANS[planId]?.maxVideoDuration ?? 10;
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
