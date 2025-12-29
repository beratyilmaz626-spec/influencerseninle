export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;          // TL fiyat
  priceUSD?: number;      // USD karşılığı (referans)
  currency: string;
  mode: 'payment' | 'subscription';
  videoLimit: number;
  videoDuration: number;  // Saniye cinsinden
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_starter',
    priceId: 'iyzico_starter_monthly',
    name: 'Starter',
    description: '20 video/ay • 10 saniyelik videolar',
    price: 949,
    priceUSD: 27,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 20,
    videoDuration: 10
  },
  {
    id: 'prod_professional',
    priceId: 'iyzico_professional_monthly',
    name: 'Professional',
    description: '45 video/ay • 15 saniyelik videolar',
    price: 3799,
    priceUSD: 108,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 45,
    videoDuration: 15
  },
  {
    id: 'prod_business',
    priceId: 'iyzico_enterprise_monthly',
    name: 'Business',
    description: '100 video/ay • 15 saniyelik videolar',
    price: 8549,
    priceUSD: 244,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 100,
    videoDuration: 15
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
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