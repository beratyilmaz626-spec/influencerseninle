export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TEc5vQjX7BmZS3',
    priceId: 'price_1SI8r5IXoILZ7benDrZEtPLb',
    name: 'Başlangıç Paketi',
    description: 'Aylık abonelik ile 20 video/ay',
    price: 10,
    currency: 'USD',
    mode: 'subscription'
  },
  {
    id: 'prod_TEcIlp5k4w8rPm',
    priceId: 'price_1SI93eIXoILZ7benaTtahoH7',
    name: 'Profesyonel Paketi',
    description: 'Aylık abonelik ile 45 video/ay',
    price: 20,
    currency: 'USD',
    mode: 'subscription'
  },
  {
    id: 'prod_TEcNTFYloSOyC6',
    priceId: 'price_1SI995IXoILZ7benbXtYoVJb',
    name: 'Kurumsal Paketi',
    description: 'Aylık abonelik ile 100 video/ay',
    price: 40,
    currency: 'USD',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};