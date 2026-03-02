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
    { name: 'E-Ticaret', icon: '🛒' },
    { name: 'Moda', icon: '👗' },
    { name: 'Teknoloji', icon: '💻' },
    { name: 'Sağlık', icon: '🏥' },
    { name: 'Yemek', icon: '🍕' },
    { name: 'Spor', icon: '⚽' },
    { name: 'Kozmetik', icon: '💄' },
    { name: 'Otomotiv', icon: '🚗' },
    { name: 'Eğitim', icon: '📚' },
    { name: 'Finans', icon: '💰' },
    { name: 'Emlak', icon: '🏠' },
    { name: 'Turizm', icon: '✈️' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Background gradient that covers header and hero */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,217,255,0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.08), transparent)
          `,
        }}
      />

      {/* Header - Scrolls away with page, transparent background */}
      <header className="relative z-50">
        <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-32 md:h-52">
            {/* Logo with animation */}
            <div className="flex items-center space-x-1 cursor-pointer flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="InfluencerSeninle Logo" 
                className="w-8 h-8 sm:w-24 sm:h-24 md:w-48 md:h-48 object-contain animate-float drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              />
              <div className="text-sm sm:text-xl md:text-2xl font-bold whitespace-nowrap">
                <span className="text-white">Influencer</span>
                <span className="text-neon-cyan">Seninle</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <Button 
                variant="ghost" 
                onClick={() => setShowAuthModal(true)}
                className="text-[11px] sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
              >
                Giriş Yap
              </Button>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="text-[11px] sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
              >
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

      {/* Comparison Section - Neden Biz */}
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
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Geleneksel influencer pazarlamasının zorluklarını AI ile aşıyoruz
            </p>
          </div>
          
          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Traditional */}
            <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-2xl font-bold text-red-400 mb-6">😓 Geleneksel Yöntem</h3>
              <ul className="space-y-4">
                {[
                  'Influencer bulma: 2-4 hafta araştırma',
                  'Çekim ve düzenleme: 1-2 hafta bekleme',
                  'Maliyet: $500 - $5.000 arası',
                  'Revizyon süreci uzun ve karmaşık',
                  'Sonuç garantisi yok',
                  'Influencer ile iletişim zorlukları',
                  'Sözleşme ve yasal süreçler'
                ].map((item, i) => (
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
                {[
                  'AI ile anında video: Dakikalar içinde hazır',
                  'Profesyonel kalite: 4K çözünürlük',
                  'Uygun fiyat: Aylık $9.90\'dan başlayan fiyatlar',
                  'Sınırsız revizyon hakkı',
                  '7/24 destek ve memnuniyet garantisi',
                  'Tek tıkla farklı dillerde içerik',
                  'Yasal süreç yok, hemen kullanıma hazır'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-neon-cyan mb-2">%90</div>
              <p className="text-gray-400 text-sm">Maliyet Tasarrufu</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-neon-purple mb-2">10x</div>
              <p className="text-gray-400 text-sm">Daha Hızlı</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-neon-pink mb-2">%300</div>
              <p className="text-gray-400 text-sm">Etkileşim Artışı</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-bold text-neon-green mb-2">24/7</div>
              <p className="text-gray-400 text-sm">Destek</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section - Extended Grid */}
      <section id="sectors" className="py-20 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Her Sektör İçin <span className="text-neon-purple">Çözüm</span>
            </h2>
            <p className="text-gray-400 text-lg">Hangi sektörde olursanız olun, size özel içerikler üretiyoruz</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 hover:bg-white/10 transition-all text-center cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{sector.icon}</div>
                <p className="text-white font-medium">{sector.name}</p>
              </div>
            ))}
          </div>

          {/* +50 Sektör Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30">
              <span className="text-2xl font-bold text-neon-cyan">+50</span>
              <span className="text-gray-300">farklı sektörde hizmet veriyoruz</span>
            </div>
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

      {/* Footer - Complete */}
      <footer className="py-16 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/logo.png" 
                  alt="InfluencerSeninle Logo" 
                  className="w-16 h-16 object-contain"
                />
                <span className="text-lg font-bold text-white">InfluencerSeninle</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI destekli UGC video oluşturma platformu. Ürünlerinizi profesyonel influencer videolarıyla tanıtın.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Ana Sayfa</a></li>
                <li><a href="#difference" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Özellikler</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Fiyatlar</a></li>
                <li><a href="#sectors" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Sektörler</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2">
                <li><a href="/gizlilik-politikasi" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Gizlilik Politikası</a></li>
                <li><a href="/kullanim-sartlari" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Kullanım Şartları</a></li>
                <li><a href="/cerez-politikasi" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">Çerez Politikası</a></li>
                <li><a href="/kvkk" className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">KVKK Aydınlatma Metni</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">📧 influencerseninle@gmail.com</li>
                <li className="text-gray-400 text-sm">📍 Ankara, Türkiye</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a 
                  href="https://instagram.com/influencerseninle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform"
                  title="Instagram'da takip et"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">© 2026 InfluencerSeninle. Tüm hakları saklıdır.</p>
              <div className="flex items-center gap-6 text-sm">
                <a href="/gizlilik-politikasi" className="text-gray-500 hover:text-neon-cyan transition-colors">Gizlilik</a>
                <a href="/kullanim-sartlari" className="text-gray-500 hover:text-neon-cyan transition-colors">Şartlar</a>
                <a href="/kvkk" className="text-gray-500 hover:text-neon-cyan transition-colors">KVKK</a>
              </div>
            </div>
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
