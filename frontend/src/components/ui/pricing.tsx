"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useStripe } from "@/hooks/useStripe";
import { useAuth } from "@/hooks/useAuth";
import { SUBSCRIPTION_PLANS, FEATURE_LABELS } from "@/config/subscription-plans";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  currency?: string;
  features: string[];
  description: string;
  buttonText: string;
  priceId?: string;
  isPopular: boolean;
}

interface PricingProps {
  plans?: PricingPlan[];
  title?: string;
  description?: string;
  setShowAuthModal?: (show: boolean) => void;
  onSelectPlan?: () => void;
}

// Varsayılan planları oluştur
const getDefaultPlans = (): PricingPlan[] => {
  return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
    name: plan.name,
    price: plan.priceMonthly.toLocaleString('tr-TR'),
    yearlyPrice: (plan.priceMonthly * 10).toLocaleString('tr-TR'),
    period: '/ay',
    currency: '₺',
    features: plan.features.map(f => FEATURE_LABELS[f]?.name || f),
    description: `${plan.monthlyVideoLimit} video/ay • ${plan.maxVideoDuration} saniyelik videolar`,
    buttonText: 'Planı Seç',
    priceId: plan.stripePriceId,
    isPopular: plan.isPopular || false,
  }));
};

export function Pricing({
  plans,
  title = "Basit, Şeffaf Fiyatlandırma",
  description = "İhtiyaçlarınıza uygun planı seçin\nTüm planlar platformumuza erişim, video oluşturma araçları ve özel destek içerir.",
  setShowAuthModal,
  onSelectPlan,
}: PricingProps) {
  // plans prop'u yoksa varsayılan planları kullan
  const displayPlans = plans || getDefaultPlans();
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  const { redirectToCheckout, loading: stripeLoading } = useStripe();
  const { user } = useAuth();

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "#3b82f6",
          "#06b6d4", 
          "#8b5cf6",
          "#f59e0b",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  const handlePlanClick = (plan: PricingPlan) => {
    console.log('🎯 handlePlanClick çağrıldı', { plan, user, priceId: plan.priceId });
    
    if (plan.priceId) {
      if (user) {
        // Kullanıcı giriş yapmış, doğrudan Stripe'a yönlendir
        console.log('✅ Kullanıcı giriş yapmış, Stripe\'a yönlendiriliyor...');
        redirectToCheckout(plan.priceId, 'payment');
      } else {
        // Kullanıcı giriş yapmamış, önce giriş modalını göster
        console.log('⚠️ Kullanıcı giriş yapmamış, modal açılıyor...');
        if (setShowAuthModal) {
          setShowAuthModal(true);
        } else {
          console.error('❌ setShowAuthModal prop bulunamadı!');
        }
      }
    } else {
      console.error('❌ priceId bulunamadı!', plan);
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-text-primary">
          {title}
        </h2>
        <p className="text-text-secondary text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-10 space-x-4">
        <span className="font-semibold text-text-primary">Tek Seferlik</span>
        <Label>
          <Switch
            ref={switchRef as any}
            checked={false}
            onCheckedChange={() => {}}
            disabled={true}
            className="relative"
          />
        </Label>
        <span className="font-semibold text-text-muted opacity-50">
          Abonelik (Yakında)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -15 : index === 0 ? 15 : 0,
                    scale: index === 0 || index === 2 ? 0.96 : 1.0,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            className={cn(
              `rounded-2xl border p-8 bg-white/5  text-center relative shadow-sm hover:shadow-glow-cyan transition-all duration-300`,
              plan.isPopular ? "border-neon-cyan border-2 shadow-glow-cyan" : "border-white/10",
              "flex flex-col h-full",
              plan.isPopular && "relative"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-glow-cyan">
                  <Star className="w-4 h-4 fill-current" />
                  <span>En Popüler</span>
                </span>
              </div>
            )}
            
            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-text-primary">
                    {plan.currency === '₺' ? (
                      <span className="tabular-nums">₺{plan.price}</span>
                    ) : (
                      <NumberFlow
                        value={
                          isMonthly ? Number(plan.price.replace(/\./g, '')) : Number(plan.yearlyPrice.replace(/\./g, ''))
                        }
                        format={{
                          style: "currency",
                          currency: plan.currency === '₺' ? "TRY" : "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        formatter={(value) => plan.price === "Özel" ? "Özel" : plan.currency === '₺' ? `₺${value.toLocaleString('tr-TR')}` : `$${value}`}
                        transformTiming={{
                          duration: 500,
                          easing: "ease-out",
                        }}
                        willChange
                        className="tabular-nums"
                      />
                    )}
                  </span>
                  {plan.price !== "Özel" && (
                    <span className="text-text-secondary ml-2">{plan.period}</span>
                  )}
                </div>
                <p className="text-text-secondary mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-left">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan)}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                    size: "lg"
                  }),
                  "w-full font-semibold transition-all duration-300 disabled:opacity-50",
                  plan.isPopular
                    ? "bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-glow-cyan text-white border-0"
                    : "border-white/20 hover:bg-white/10 text-text-primary"
                )}
                disabled={stripeLoading}
              >
                {stripeLoading ? 'Yükleniyor...' : plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}