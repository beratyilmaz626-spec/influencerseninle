export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;          // USD fiyat
  currency: string;
  mode: 'payment' | 'subscription';
  videoLimit: number;
  videoDuration: number;  // Saniye cinsinden
  monthlyCredits: number; // Aylık kredi miktarı
  features: string[];     // Özellikler listesi
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_starter',
    priceId: 'iyzico_starter_monthly',
    name: 'Başlangıç Paketi',
    description: '2000 kredi - 20 adet HD kalite ve filigransız video üretin',
    price: 9.90,
    currency: 'USD',
    mode: 'subscription',
    videoLimit: 20,
    videoDuration: 15,
    monthlyCredits: 2000,
    features: [
      '20 adet HD kalite video',
      'Filigransız videolar',
      'Temel şablonlar',
      'E-posta desteği'
    ]
  },
  {
    id: 'prod_professional',
    priceId: 'iyzico_professional_monthly',
    name: 'Profesyonel Paketi',
    description: '4500 kredi - 45 adet HD kalite ve filigransız video üretin',
    price: 19.90,
    currency: 'USD',
    mode: 'subscription',
    videoLimit: 45,
    videoDuration: 15,
    monthlyCredits: 4500,
    features: [
      '45 adet HD kalite video',
      'Filigransız videolar',
      'Premium şablonlar',
      'Öncelikli destek',
      'API erişimi'
    ]
  },
  {
    id: 'prod_business',
    priceId: 'iyzico_enterprise_monthly',
    name: 'İşletme Paketi',
    description: '10000 kredi - 100 adet HD kalite ve filigransız video üretin',
    price: 39.90,
    currency: 'USD',
    mode: 'subscription',
    videoLimit: 100,
    videoDuration: 15,
    monthlyCredits: 10000,
    features: [
      '100 adet HD kalite video',
      'Filigransız videolar',
      'Özel şablonlar',
      'Özel destek',
      'Gelişmiş API',
      'Beyaz etiket seçeneği'
    ]
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

// USD formatı için yardımcı fonksiyon
export const formatPriceUSD = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Legacy TL format fonksiyonu (geriye uyumluluk)
export const formatPriceTRY = formatPriceUSD;