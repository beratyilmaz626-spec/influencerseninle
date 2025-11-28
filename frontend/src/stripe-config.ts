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
    description: '20 adet HD kalite ve filimgransız video üretin',
    price: 9.90,
    currency: 'USD',
    mode: 'payment'
  },
  {
    id: 'prod_TEcIlp5k4w8rPm',
    priceId: 'price_1SI93eIXoILZ7benaTtahoH7',
    name: 'Profesyonel Paketi',
    description: '45 adet HD kalite ve filigransız video üretin',
    price: 19.90,
    currency: 'USD',
    mode: 'payment'
  },
  {
    id: 'prod_TEcNTFYloSOyC6',
    priceId: 'price_1SI995IXoILZ7benbXtYoVJb',
    name: 'Kurumsal Paketi',
    description: '100 adet HD kalite ve filigransız video üretin',
    price: 39.90,
    currency: 'USD',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};