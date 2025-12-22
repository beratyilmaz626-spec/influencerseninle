import { CheckCircle2, Crown, Zap, Building2, Download } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function SubscriptionPanel() {
  const { subscription, loading, getActiveProduct, isActive } = useSubscription();
  const { redirectToCheckout, loading: stripeLoading } = useStripe();
  
  const activeProduct = getActiveProduct();
  const currentPlan = activeProduct?.name.toLowerCase().includes('başlangıç') ? 'starter' :
                    activeProduct?.name.toLowerCase().includes('profesyonel') ? 'professional' :
                    activeProduct?.name.toLowerCase().includes('kurumsal') ? 'enterprise' : null;

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Planlar ve Faturalandırma</h1>
        <p className="text-text-secondary">Aboneliğinizi ve faturalandırma detaylarınızı yönetin</p>
      </div>

      {/* Premium Current Plan Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {loading ? 'Yükleniyor...' : activeProduct?.name || 'Plan Bulunamadı'}
                  </h2>
                  <p className="text-text-secondary text-sm">
                    {isActive() ? 'Aktif aboneliğiniz' : 'Abonelik durumu'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="glass-card px-5 py-3 rounded-xl">
                  <p className="text-text-muted text-sm mb-1">Kalan Krediler</p>
                  <p className="text-2xl font-bold text-neon-cyan">
                    {loading ? '...' : subscription ? '-- / --' : '0 / 0'}
                  </p>
                </div>
                <div className="glass-card px-5 py-3 rounded-xl">
                  <p className="text-text-muted text-sm mb-1">Yenileme Tarihi</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {loading ? '...' : subscription?.current_period_end 
                      ? new Date(subscription.current_period_end * 1000).toLocaleDateString('tr-TR')
                      : '--'
                    }
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline">
              Aboneliği Yönet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Premium Plans Grid */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Mevcut Planlar</h2>

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
                price={String(Math.round(product.price))}
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

      {/* Premium Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Faturalandırma Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <BillingRow date="12 Eki 2025" amount="$99.00" status="Ödendi" plan="Profesyonel Plan" />
            <BillingRow date="12 Eyl 2025" amount="$99.00" status="Ödendi" plan="Profesyonel Plan" />
            <BillingRow date="12 Ağu 2025" amount="$29.00" status="Ödendi" plan="Başlangıç Planı" />
          </div>
        </CardContent>
      </Card>

      {/* Premium Help Card */}
      <Card className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border-neon-cyan/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Seçim Yapmakta Yardıma İhtiyacınız Var mı?</h3>
          <p className="text-text-secondary mb-4">
            Ekibimiz ihtiyaçlarınız için mükemmel planı bulmanızda size yardımcı olmak için burada
          </p>
          <Button variant="premium">
            Görüşme Planla
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function getFeaturesByPlan(planType: string): string[] {
  switch (planType) {
    case 'starter':
      return [
        '20 video/ay',
        'HD 1080p dışa aktarma',
        'Filigransız videolar',
        'Temel şablonlar',
        'E-posta desteği'
      ];
    case 'professional':
      return [
        '45 video/ay',
        'HD 1080p dışa aktarma',
        'Filigransız videolar',
        'Premium şablonlar',
        'Öncelikli destek',
        'API erişimi'
      ];
    case 'enterprise':
      return [
        '100 video/ay',
        'HD 1080p dışa aktarma',
        'Filigransız videolar',
        'Premium şablonlar',
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
      className={`relative glass-card p-6 ${
        highlighted ? 'ring-2 ring-neon-cyan shadow-glow-cyan' : ''
      } hover:shadow-glow-cyan transition-all duration-300`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="info" className="text-xs font-semibold">
            En Popüler
          </Badge>
        </div>
      )}

      <div className="text-center mb-6">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            highlighted 
              ? 'bg-gradient-to-br from-neon-cyan to-neon-purple text-white shadow-glow-cyan' 
              : 'bg-surface-elevated text-neon-cyan'
          }`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">{name}</h3>
        <div className="flex items-baseline justify-center mb-2">
          {price !== 'Özel' && <span className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">${price}</span>}
          {price === 'Özel' && <span className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">{price}</span>}
          {price !== 'Özel' && <span className="text-text-muted ml-2">/ay</span>}
        </div>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
            <span className="text-text-secondary text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        disabled={isActive || loading}
        onClick={onButtonClick}
        variant={isActive ? 'outline' : highlighted ? 'premium' : 'default'}
        className="w-full"
      >
        {loading ? 'Yükleniyor...' : buttonText}
      </Button>
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border last:border-0">
      <div className="mb-2 sm:mb-0">
        <p className="font-medium text-text-primary">{plan}</p>
        <p className="text-sm text-text-muted">{date}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-text-primary">{amount}</span>
        <Badge variant="success">{status}</Badge>
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4 mr-2" />
          İndir
        </Button>
      </div>
    </div>
  );
}
