import { CheckCircle2, Crown, Zap, Building2, Sparkles } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts, formatPriceUSD } from '../stripe-config';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function SubscriptionPanel() {
  const { subscription, loading, getActiveProduct, isActive } = useSubscription();
  const { redirectToCheckout, loading: stripeLoading } = useStripe();
  
  const activeProduct = getActiveProduct();
  const currentPlan = activeProduct?.name.toLowerCase().includes('başlangıç') ? 'starter' :
                    activeProduct?.name.toLowerCase().includes('profesyonel') ? 'professional' :
                    activeProduct?.name.toLowerCase().includes('işletme') ? 'enterprise' : null;

  const planIcons: Record<string, any> = {
    starter: Zap,
    professional: Crown,
    enterprise: Building2,
  };

  const planColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    starter: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
    },
    professional: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
    },
    enterprise: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Planlar ve Faturalandırma</h1>
        <p className="text-text-secondary">İhtiyacınıza en uygun planı seçin</p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stripeProducts.map((product) => {
          const planType = product.name.toLowerCase().includes('başlangıç') ? 'starter' :
                         product.name.toLowerCase().includes('profesyonel') ? 'professional' :
                         product.name.toLowerCase().includes('kurumsal') ? 'enterprise' : 'other';
          
          const isCurrentPlan = currentPlan === planType;
          const colors = planColors[planType] || planColors.starter;
          const Icon = planIcons[planType] || Zap;
          const isPopular = planType === 'professional';
          
          return (
            <Card 
              key={product.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                isCurrentPlan 
                  ? `${colors.border} ${colors.bg} ring-2 ring-offset-2 ring-offset-bg-primary ${colors.border.replace('border-', 'ring-')}` 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popüler Badge */}
              {isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    EN POPÜLER
                  </div>
                </div>
              )}

              {/* Mevcut Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-4 left-4">
                  <Badge className={`${colors.bg} ${colors.text} border-0`}>
                    ✓ Mevcut Plan
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 pt-12">
                {/* Plan Icon & Name */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.monthlyCredits.toLocaleString()} kredi</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className={`text-4xl font-bold ${colors.text}`}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-base ml-1">/ay</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle2 className={`w-5 h-5 ${colors.text} mr-3 flex-shrink-0`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => !isCurrentPlan && redirectToCheckout(product.priceId)}
                  disabled={isCurrentPlan || stripeLoading}
                  className={`w-full py-3 font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${
                          planType === 'starter' ? 'from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/25' :
                          planType === 'professional' ? 'from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/25' :
                          'from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25'
                        } text-white`
                  }`}
                >
                  {isCurrentPlan ? '✓ Mevcut Planınız' : 
                   stripeLoading ? 'Yükleniyor...' : 
                   `${product.name}'i Seç`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Box */}
      <Card className="border-cyan-500/20 bg-cyan-500/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400">💡</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Kredi Sistemi Nasıl Çalışır?</h4>
              <p className="text-xs text-gray-400">
                Her video oluşturma işlemi <span className="text-cyan-400 font-semibold">100 kredi</span> harcar. 
                Yeni üyeler <span className="text-emerald-400 font-semibold">200 kredi hediye</span> kazanır (2 video hakkı).
                Kullanılmayan krediler bir sonraki aya devretmez.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription Info */}
      {isActive() && subscription && (
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Abonelik Bilgileri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Mevcut Plan</p>
                <p className="text-sm font-semibold text-white">{activeProduct?.name || 'Yok'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Aylık Kredi</p>
                <p className="text-sm font-semibold text-cyan-400">{activeProduct?.monthlyCredits?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Yenileme Tarihi</p>
                <p className="text-sm font-semibold text-white">
                  {subscription.current_period_end 
                    ? new Date(subscription.current_period_end * 1000).toLocaleDateString('tr-TR')
                    : '--'}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Durum</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Aktif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
