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
  monthlyCredits: number; // Aylık kredi miktarı
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_starter',
    priceId: 'iyzico_starter_monthly',
    name: 'Başlangıç',
    description: '2.000 Kredi • 20 Video • 15 sn',
    price: 949,
    priceUSD: 27,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 20,
    videoDuration: 15,
    monthlyCredits: 2000
  },
  {
    id: 'prod_professional',
    priceId: 'iyzico_professional_monthly',
    name: 'Profesyonel',
    description: '4.500 Kredi • 45 Video • 15 sn',
    price: 3799,
    priceUSD: 108,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 45,
    videoDuration: 15,
    monthlyCredits: 4500
  },
  {
    id: 'prod_business',
    priceId: 'iyzico_enterprise_monthly',
    name: 'Business',
    description: '10.000 Kredi • 100 Video • 15 sn',
    price: 8549,
    priceUSD: 244,
    currency: 'TRY',
    mode: 'subscription',
    videoLimit: 100,
    videoDuration: 15,
    monthlyCredits: 10000
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