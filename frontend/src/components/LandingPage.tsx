import { useState } from 'react';
import { Play, Sparkles, Zap, Video, CheckCircle2, Clock, DollarSign, Package, Shield, RefreshCcw, Palette, Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { VideoSlider } from '@/components/ui/video-slider';
import { Pricing } from '@/components/ui/pricing';
import HeroSection from './HeroSection';
import DifferenceSection from './DifferenceSection';

interface LandingPageProps {
  onGetStarted: () => void;
  onAuthSuccess: () => void;
}

export default function LandingPage({ onGetStarted, onAuthSuccess }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const sectors = [
    { name: 'E-Ticaret', icon: '🛒', color: 'from-blue-500 to-cyan-500' },
    { name: 'Moda', icon: '👗', color: 'from-pink-500 to-rose-500' },
    { name: 'Teknoloji', icon: '💻', color: 'from-purple-500 to-indigo-500' },
    { name: 'Sağlık', icon: '🏥', color: 'from-green-500 to-emerald-500' },
    { name: 'Yemek', icon: '🍕', color: 'from-orange-500 to-amber-500' },
    { name: 'Spor', icon: '⚽', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Header - Simple, no blur */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/95">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">
            {/* Logo */}
            <div className="flex items-center space-x-4 cursor-pointer">
              <img 
                src="/images/logo.png" 
                alt="InfluencerSeninle Logo" 
                className="w-40 h-40 object-contain"
              />
              <div className="text-xl font-bold">
                <span className="text-white">Influencer</span>
                <span className="text-neon-cyan">Seninle</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                Giriş Yap
              </Button>
              <Button onClick={() => setShowAuthModal(true)}>
                Başlayın
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <HeroSection onGetStarted={() => setShowAuthModal(true)} />

      {/* Difference Section */}
      <DifferenceSection onGetStarted={() => setShowAuthModal(true)} />

      {/* Video Examples - Simple */}
      <section className="py-20 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Gerçek <span className="text-neon-cyan">Örnekler</span>
            </h2>
            <p className="text-gray-400 text-lg">AI ile oluşturulmuş profesyonel UGC videolar</p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f1a]">
            <VideoSlider />
          </div>
        </div>
      </section>

      {/* Comparison Section - Simplified */}
      <section id="comparison" className="py-20 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">Farkı Gör</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Neden <span className="text-neon-cyan">Biz?</span>
            </h2>
          </div>
          
          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional */}
            <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-2xl font-bold text-red-400 mb-6">😓 Geleneksel Yöntem</h3>
              <ul className="space-y-4">
                {['Influencer bulma: 2-4 hafta', 'Çekim ve düzenleme: 1-2 hafta', 'Maliyet: 5.000₺ - 50.000₺', 'Revizyon süreci uzun', 'Sonuç garantisi yok'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <span className="text-red-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Way */}
            <div className="p-8 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20">
              <h3 className="text-2xl font-bold text-neon-cyan mb-6">🚀 InfluencerSeninle</h3>
              <ul className="space-y-4">
                {['AI ile anında video: Dakikalar içinde', 'Profesyonel kalite: 4K çözünürlük', 'Uygun fiyat: Aylık 299₺\'den başlayan', 'Sınırsız revizyon hakkı', '7/24 destek ve garanti'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section - Simple Grid */}
      <section id="sectors" className="py-20 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Her Sektör İçin <span className="text-neon-purple">Çözüm</span>
            </h2>
            <p className="text-gray-400">Hangi sektörde olursanız olun, size özel içerikler</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 transition-colors text-center cursor-pointer"
              >
                <div className="text-4xl mb-3">{sector.icon}</div>
                <p className="text-white font-medium">{sector.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Basit <span className="text-neon-cyan">Fiyatlandırma</span>
            </h2>
            <p className="text-gray-400">İhtiyacınıza uygun planı seçin</p>
          </div>
          <Pricing onSelectPlan={() => setShowAuthModal(true)} />
        </div>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-20 bg-[#030712]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hemen <span className="text-neon-cyan">Başlayın</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            İlk videonuzu ücretsiz oluşturun
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Ücretsiz Deneyin
          </button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.png" 
                alt="InfluencerSeninle Logo" 
                className="w-16 h-16 object-contain"
              />
              <span className="text-lg font-bold text-white">InfluencerSeninle</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-neon-cyan transition-colors">Özellikler</a>
              <a href="#pricing" className="hover:text-neon-cyan transition-colors">Fiyatlar</a>
              <a href="#sectors" className="hover:text-neon-cyan transition-colors">Sektörler</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-sm">© 2026 InfluencerSeninle. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onAuthSuccess}
      />
    </div>
  );
}
