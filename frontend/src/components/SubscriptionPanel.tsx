import { CheckCircle2, Crown, Zap, Building2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';

export default function SubscriptionPanel() {
  const { subscription, loading, getActiveProduct, isActive } = useSubscription();
  const { redirectToCheckout, loading: stripeLoading } = useStripe();
  
  const activeProduct = getActiveProduct();
  const currentPlan = activeProduct?.name.toLowerCase().includes('başlangıç') ? 'starter' :
                     activeProduct?.name.toLowerCase().includes('profesyonel') ? 'professional' :
                     activeProduct?.name.toLowerCase().includes('kurumsal') ? 'enterprise' : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planlar ve Faturalandırma</h1>
        <p className="text-gray-600">Aboneliğinizi ve faturalandırma detaylarınızı yönetin</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Yükleniyor...' : activeProduct?.name || 'Plan Bulunamadı'}
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              {isActive() ? 'Aktif aboneliğiniz' : 'Abonelik durumu'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="bg-white rounded-lg px-4 py-2">
                <p className="text-gray-600">Kalan Krediler</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : subscription ? '-- / --' : '0 / 0'}
                </p>
              </div>
              <div className="bg-white rounded-lg px-4 py-2">
                <p className="text-gray-600">Yenileme Tarihi</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loading ? '...' : subscription?.current_period_end 
                    ? new Date(subscription.current_period_end * 1000).toLocaleDateString('tr-TR')
                    : '--'
                  }
                </p>
              </div>
            </div>
          </div>
          <button className="mt-4 md:mt-0 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
            Aboneliği Yönet
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mevcut Planlar</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {stripeProducts.map((product, index) => {
            const planType = product.name.toLowerCase().includes('başlangıç') ? 'starter' :
                           product.name.toLowerCase().includes('profesyonel') ? 'professional' :
                           product.name.toLowerCase().includes('kurumsal') ? 'enterprise' : 'other';
            
            const isCurrentPlan = currentPlan === planType;
            
            return (
              <PlanCard
                key={product.id}
                name={product.name}
                icon={planType === 'starter' ? <Zap className="w-8 h-8" /> :
                      planType === 'professional' ? <Crown className="w-8 h-8" /> :
                      <Building2 className="w-8 h-8" />}
                price={product.price.toFixed(2)}
                description={product.description}
                features={getFeaturesByPlan(planType)}
                isActive={isCurrentPlan}
                highlighted={planType === 'professional'}
                buttonText={isCurrentPlan ? 'Mevcut Plan' : 
                           planType === 'enterprise' ? 'Satış Ekibiyle İletişime Geç' : 
                           'Planı Seç'}
                onButtonClick={() => {
                  if (!isCurrentPlan && planType !== 'enterprise') {
                    redirectToCheckout(product.priceId, 'payment');
                  }
                }}
                loading={stripeLoading}
              />
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Faturalandırma Geçmişi</h3>
        <div className="space-y-3">
          <BillingRow date="12 Eki 2025" amount="$99.00" status="Ödendi" plan="Profesyonel Plan" />
          <BillingRow date="12 Eyl 2025" amount="$99.00" status="Ödendi" plan="Profesyonel Plan" />
          <BillingRow date="12 Ağu 2025" amount="$29.00" status="Ödendi" plan="Başlangıç Planı" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Seçim Yapmakta Yardıma İhtiyacınız Var mı?</h3>
        <p className="text-gray-600 mb-4">
          Ekibimiz ihtiyaçlarınız için mükemmel planı bulmanızda size yardımcı olmak için burada
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Görüşme Planla
        </button>
      </div>
    </div>
  );
}

function getFeaturesByPlan(planType: string): string[] {
  switch (planType) {
    case 'starter':
      return [
        '20 adet HD kalite video',
        'Filigransız videolar',
        'Temel şablonlar',
        'E-posta desteği'
      ];
    case 'professional':
      return [
        '45 adet HD kalite video',
        'Filigransız videolar',
        'Premium şablonlar',
        'Öncelikli destek',
        'API erişimi'
      ];
    case 'enterprise':
      return [
        '100 adet HD kalite video',
        'Filigransız videolar',
        'Özel şablonlar',
        'Özel destek',
        'Gelişmiş API',
        'Beyaz etiket seçeneği'
      ];
    default:
      return [];
  }
}

function PlanCard({
  name,
  icon,
  price,
  description,
  features,
  isActive,
  highlighted = false,
  buttonText,
  onButtonClick,
  loading = false,
}: {
  name: string;
  icon: React.ReactNode;
  price: string;
  description: string;
  features: string[];
  isActive: boolean;
  highlighted?: boolean;
  buttonText: string;
  onButtonClick?: () => void;
  loading?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 ${
        highlighted ? 'ring-2 ring-blue-500 shadow-xl' : 'border border-gray-200 shadow-sm'
      } relative`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            En Popüler
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            highlighted ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
          }`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline justify-center mb-2">
          {price !== 'Özel' && <span className="text-4xl font-bold text-gray-900">${price}</span>}
          {price === 'Özel' && <span className="text-4xl font-bold text-gray-900">{price}</span>}
          {price !== 'Özel' && <span className="text-gray-600 ml-2">/ay</span>}
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isActive || loading}
        onClick={onButtonClick}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isActive || loading
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : highlighted
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {loading ? 'Yükleniyor...' : buttonText}
      </button>
    </div>
  );
}

function BillingRow({
  date,
  amount,
  status,
  plan,
}: {
  date: string;
  amount: string;
  status: string;
  plan: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="mb-2 sm:mb-0">
        <p className="font-medium text-gray-900">{plan}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-900">{amount}</span>
        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
          {status}
        </span>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          İndir
        </button>
      </div>
    </div>
  );
}