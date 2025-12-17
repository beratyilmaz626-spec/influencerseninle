// Aylık Abonelik Paketleri Konfigürasyonu
// SADECE AYLIK ABONELİK - TEK SEFERLİK VEYA YILLIK ÖDEME YOK

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
  | 'white_label';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  nameEn: string;
  description: string;
  priceMonthly: number;
  currency: string;
  stripePriceId: string;
  monthlyVideoLimit: number;
  features: FeatureId[];
  isPopular?: boolean;
}

// Stripe Price ID'leri - AYLIK ABONELİK
export const STRIPE_PRICE_IDS = {
  starter: 'price_starter_monthly', // Stripe'da oluşturulacak
  professional: 'price_professional_monthly',
  enterprise: 'price_enterprise_monthly',
} as const;

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: 'Başlangıç',
    nameEn: 'Starter',
    description: 'Küçük işletmeler ve bireysel kullanıcılar için ideal',
    priceMonthly: 10,
    currency: 'USD',
    stripePriceId: STRIPE_PRICE_IDS.starter,
    monthlyVideoLimit: 20,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'email_support',
    ],
    isPopular: false,
  },
  professional: {
    id: 'professional',
    name: 'Profesyonel',
    nameEn: 'Professional',
    description: 'Büyüyen işletmeler ve ajanslar için',
    priceMonthly: 20,
    currency: 'USD',
    stripePriceId: STRIPE_PRICE_IDS.professional,
    monthlyVideoLimit: 45,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'premium_templates',
      'priority_support',
      'api_access',
    ],
    isPopular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Kurumsal',
    nameEn: 'Enterprise',
    description: 'Büyük organizasyonlar ve kurumsal müşteriler için',
    priceMonthly: 40,
    currency: 'USD',
    stripePriceId: STRIPE_PRICE_IDS.enterprise,
    monthlyVideoLimit: 100,
    features: [
      'hd_video',
      'no_watermark',
      'basic_templates',
      'premium_templates',
      'dedicated_support',
      'api_access',
      'advanced_api',
      'white_label',
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

export const getAllPlans = (): SubscriptionPlan[] => {
  return Object.values(SUBSCRIPTION_PLANS);
};
