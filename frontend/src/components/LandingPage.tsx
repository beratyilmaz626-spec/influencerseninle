import { useState } from 'react';
import { Play, Sparkles, Zap, Video, ArrowRight, CheckCircle2, Star, X, Clock, DollarSign, Package, Shield, RefreshCcw, Palette, Users, Globe, Rocket, Building2, ShoppingBag, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const features = [
    {
      icon: Sparkles,
      title: 'AI Destekli Oluşturma',
      description: 'Gelişmiş AI teknolojisi ile saniyeler içinde profesyonel videolar oluşturun'
    },
    {
      icon: Zap,
      title: 'Yıldırım Hızı',
      description: 'Geleneksel yöntemlere göre 10 kat daha hızlı yüksek kaliteli video içeriği üretin'
    },
    {
      icon: Video,
      title: 'HD Kalite Çıktı',
      description: 'Her platform için hazır 4K çözünürlükte muhteşem videolar dışa aktarın'
    }
  ];

  // Sektör kategorileri
  const sectors = [
    { emoji: '🤖', name: 'AI', color: 'from-neon-cyan to-neon-purple' },
    { emoji: '💪', name: 'Fitness', color: 'from-orange-500 to-red-500' },
    { emoji: '💻', name: 'Teknoloji', color: 'from-blue-500 to-indigo-500' },
    { emoji: '🍎', name: 'Beslenme', color: 'from-green-500 to-emerald-500' },
    { emoji: '📈', name: 'Pazarlama', color: 'from-yellow-500 to-orange-500' },
    { emoji: '₿', name: 'Kripto', color: 'from-yellow-400 to-amber-500' },
    { emoji: '💕', name: 'İlişkiler', color: 'from-pink-500 to-rose-400' },
    { emoji: '⚖️', name: 'Hukuk', color: 'from-indigo-500 to-purple-500' },
    { emoji: '💰', name: 'Finans', color: 'from-green-500 to-teal-500' },
    { emoji: '🛒', name: 'E-ticaret', color: 'from-neon-cyan to-blue-500' },
    { emoji: '✈️', name: 'Seyahat', color: 'from-sky-500 to-blue-500' },
    { emoji: '👨‍💻', name: 'Geliştirici', color: 'from-emerald-500 to-green-500' },
    { emoji: '🏢', name: 'Kurumsal', color: 'from-slate-500 to-gray-500' },
    { emoji: '👔', name: 'Kariyer', color: 'from-teal-500 to-cyan-500' },
    { emoji: '💼', name: 'İş', color: 'from-amber-500 to-yellow-500' },
    { emoji: '📊', name: 'Ticaret', color: 'from-red-500 to-pink-500' },
    { emoji: '🎮', name: 'Oyun', color: 'from-purple-500 to-indigo-500' },
    { emoji: '👶', name: 'Çocuk', color: 'from-pink-500 to-rose-500' },
    { emoji: '🔮', name: 'Astroloji', color: 'from-purple-500 to-violet-500' },
    { emoji: '🗣️', name: 'Dil', color: 'from-blue-500 to-indigo-500' },
    { emoji: '📚', name: 'Kitaplar', color: 'from-emerald-500 to-teal-500' },
    { emoji: '💄', name: 'Güzellik', color: 'from-pink-500 to-rose-500' },
    { emoji: '🏥', name: 'Medikal', color: 'from-red-500 to-pink-500' },
    { emoji: '💋', name: 'Kozmetik', color: 'from-neon-pink to-pink-500' },
    { emoji: '🎨', name: 'Tasarım', color: 'from-violet-500 to-purple-500' },
    { emoji: '🏘️', name: 'Emlak', color: 'from-green-500 to-emerald-500' },
    { emoji: '👗', name: 'Moda', color: 'from-neon-purple to-pink-500' },
    { emoji: '🎵', name: 'Müzik', color: 'from-indigo-500 to-blue-500' },
  ];

  // Kategori kartları
  const categoryCards = [
    { emoji: '💄', title: 'Güzellik', color: 'from-pink-500 to-rose-400' },
    { emoji: '👗', title: 'Moda', color: 'from-neon-purple to-indigo-500' },
    { emoji: '💪', title: 'Fitness', color: 'from-orange-500 to-red-500' },
    { emoji: '🍎', title: 'Beslenme', color: 'from-green-500 to-emerald-500' },
    { emoji: '💻', title: 'Teknoloji', color: 'from-neon-cyan to-blue-500' },
    { emoji: '🏠', title: 'Emlak', color: 'from-emerald-500 to-teal-500' },
    { emoji: '🎮', title: 'Oyun', color: 'from-purple-600 to-pink-500' },
    { emoji: '✈️', title: 'Seyahat', color: 'from-sky-500 to-blue-500' }
  ];

 

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-glass bg-background/80">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold">
                <span className="text-text-primary">Influencer</span>
                <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Seninle</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                Giriş Yap
              </Button>
              <Button onClick={() => setShowAuthModal(true)}>
                Başlayın
              </Button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-sm px-3 py-2"
              >
                Giriş Yap
              </Button>
              <Button 
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-sm px-3 py-2"
              >
                Başla
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <HeroSection onGetStarted={() => setShowAuthModal(true)} />

      {/* Farkı Kendiniz Görün Section */}
      <DifferenceSection onGetStarted={() => setShowAuthModal(true)} />

      {/* Video Slider Preview */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Gerçek <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Örnekler</span>
            </h2>
            <p className="text-gray-400 text-lg">AI ile oluşturulmuş profesyonel UGC videolar</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />
              <div className="relative h-[400px] md:h-[500px] glass-card rounded-3xl overflow-hidden border border-white/10">
                <VideoSlider />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Biz vs Onlar - Karşılaştırma Bölümü */}
      <section id="comparison" className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">Farkı Gör</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Neden <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">Biz?</span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              Geleneksel yöntemlerle AI tabanlı UGC arasındaki <span className="text-neon-cyan font-semibold">devasa farkı</span> keşfet
            </p>
          </motion.div>

          {/* Desktop/Tablet Header */}
          <motion.div 
            className="hidden md:grid grid-cols-7 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="col-span-3" />
            <div className="col-span-2 text-center">
              <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  InfluencerSeninle
                </span>
                <span className="text-xs text-text-muted mt-1">AI Tabanlı UGC</span>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-surface/50 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-2">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-red-400">
                  Geleneksel
                </span>
                <span className="text-xs text-text-muted mt-1">Ajanslar & Diğer Araçlar</span>
              </div>
            </div>
          </motion.div>

          {/* Comparison Rows */}
          <div className="space-y-3 md:space-y-4">
            {[
              { feature: 'İçerik Üretim Hızı', icon: Clock, us: '24-48 Saat', them: '2-4 Hafta', usDetail: 'Anında sonuç', themDetail: 'Uzun süreçler' },
              { feature: 'Maliyet', icon: DollarSign, us: '%70 Daha Uygun', them: 'Yüksek Ücretler', usDetail: '₺949-8.549/ay', themDetail: 'Binlerce TL' },
              { feature: 'Lojistik & Kargo', icon: Package, us: 'Otomatik Süreç', them: 'Manuel Takip', usDetail: 'Sıfır lojistik', themDetail: 'Ürün gönderimi' },
              { feature: 'Risk Faktörleri', icon: Shield, us: 'Garantili Teslimat', them: 'Belirsiz Sonuç', usDetail: 'Her zaman hazır', themDetail: 'İptal riski' },
              { feature: 'Revizyon İmkanı', icon: RefreshCcw, us: 'Sınırsız Revizyon', them: 'Ekstra Ücret', usDetail: 'İstediğin kadar', themDetail: 'Sınırlı haklar' },
              { feature: 'İçerik Çeşitliliği', icon: Palette, us: 'Sınırsız Varyasyon', them: 'Tek Çekim', usDetail: 'Yüzlerce stil', themDetail: 'Standart içerik' },
            ].map((row, index) => {
              const IconComponent = row.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  {/* Desktop/Tablet Row */}
                  <div className="hidden md:grid grid-cols-7 gap-4 items-center p-4 rounded-2xl bg-surface/30 border border-white/5 hover:border-neon-cyan/20 hover:bg-surface/50 transition-all duration-300">
                    {/* Feature */}
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-neon-cyan" />
                      </div>
                      <span className="text-lg font-semibold text-white">{row.feature}</span>
                    </div>
                    
                    {/* Us - Winner */}
                    <div className="col-span-2">
                      <div className="relative p-4 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 text-center group-hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-shadow">
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-background" />
                        </div>
                        <div className="text-lg font-bold text-neon-cyan mb-1">{row.us}</div>
                        <div className="text-xs text-text-muted">{row.usDetail}</div>
                      </div>
                    </div>
                    
                    {/* Them - Loser */}
                    <div className="col-span-2">
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center opacity-70">
                        <div className="text-lg font-medium text-red-400 mb-1">{row.them}</div>
                        <div className="text-xs text-text-muted">{row.themDetail}</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden p-4 rounded-2xl bg-surface/30 border border-white/5 space-y-4">
                    {/* Feature Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-neon-cyan" />
                      </div>
                      <span className="text-base font-semibold text-white">{row.feature}</span>
                    </div>
                    
                    {/* Comparison Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Us */}
                      <div className="relative p-3 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20">
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-cyan flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-background" />
                        </div>
                        <div className="text-xs text-neon-cyan font-medium mb-1">Biz</div>
                        <div className="text-sm font-bold text-white">{row.us}</div>
                        <div className="text-xs text-text-muted mt-1">{row.usDetail}</div>
                      </div>
                      
                      {/* Them */}
                      <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 opacity-70">
                        <div className="text-xs text-red-400 font-medium mb-1">Onlar</div>
                        <div className="text-sm font-medium text-red-300">{row.them}</div>
                        <div className="text-xs text-text-muted mt-1">{row.themDetail}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="mt-12 md:mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-neon-cyan/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">Hemen Başla</div>
                  <div className="text-sm text-text-muted">İlk videon bizden hediye</div>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
              >
                Planları İncele
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sektörler / Kullanım Alanları */}
      <section id="sectors" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
            >
              Tüm Sektörler İçin{' '}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Akıllı Çözüm
              </span>
            </motion.h2>
          </div>

          {/* Sektör Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {sectors.map((sector, index) => (
                <button
                  key={index}
                  className={`bg-white/5 hover:bg-gradient-to-r hover:${sector.color} backdrop-blur-sm text-text-primary hover:text-white px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10 hover:border-transparent shadow-lg hover:shadow-glow-cyan hover:scale-105`}
                >
                  <span>{sector.emoji}</span>
                  <span>{sector.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Kategori Kartları Slider */}
          <div className="mt-12">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {categoryCards.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-glow-purple transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="text-8xl mb-4 animate-pulse">{item.emoji}</div>
                        <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-white/90 text-center text-sm">
                          AI ile üretilmiş profesyonel içerik
                        </p>
                      </div>
                    </div>
                    
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    
                    {/* AI Badge */}
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                      <span className="text-white text-xs font-semibold">AI Üretimi</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Scroll Hint */}
            <div className="text-center mt-4 text-text-secondary text-sm">
              ← Kaydırarak daha fazla içerik görün →
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Neden Platformumuzu Seçmelisiniz?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Video oluşturmayı zahmetsiz hale getiren güçlü özellikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="holographic-hover h-full hover:shadow-glow-cyan transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mb-6 shadow-glow-cyan">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8">
            <Pricing
              plans={[
                {
                  name: "Starter",
                  price: "949",
                  yearlyPrice: "949",
                  period: "/ay",
                  currency: "₺",
                  features: [
                    "20 video/ay",
                    "10 saniyelik videolar",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Temel şablonlar",
                    "E-posta desteği",
                  ],
                  description: "10 saniyelik videolar ile başlangıç paketi",
                  buttonText: "Planı Seç",
                  priceId: "iyzico_starter_monthly",
                  isPopular: false,
                },
                {
                  name: "Professional",
                  price: "3.799",
                  yearlyPrice: "3.799",
                  period: "/ay",
                  currency: "₺",
                  features: [
                    "45 video/ay",
                    "15 saniyelik videolar",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Premium şablonlar",
                    "Öncelikli destek",
                    "API erişimi",
                  ],
                  description: "15 saniyelik videolar ile profesyonel paket",
                  buttonText: "Planı Seç",
                  priceId: "iyzico_professional_monthly",
                  isPopular: true,
                },
                {
                  name: "Business",
                  price: "8.549",
                  yearlyPrice: "8.549",
                  period: "/ay",
                  currency: "₺",
                  features: [
                    "100 video/ay",
                    "15 saniyelik videolar",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Premium şablonlar",
                    "Özel destek",
                    "Gelişmiş API",
                    "Beyaz etiket seçeneği",
                  ],
                  description: "15 saniyelik videolar ile kurumsal paket",
                  buttonText: "Planı Seç",
                  priceId: "iyzico_enterprise_monthly",
                  isPopular: false,
                },
              ]}
              title="Uygun, Şeffaf Fiyatlandırma"
              description="İhtiyaçlarınıza uygun planı seçin. Tüm fiyatlar TL olarak gösterilmektedir."
              setShowAuthModal={setShowAuthModal}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section - Premium */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[#030712]" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,217,255,0.15), transparent 50%),
              radial-gradient(ellipse 80% 50% at 0% 50%, rgba(168,85,247,0.1), transparent),
              radial-gradient(ellipse 80% 50% at 100% 50%, rgba(255,0,128,0.1), transparent)
            `,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Rocket className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-semibold text-neon-cyan">Hemen Başla</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Video Üretimini
              <br />
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Dönüştürmeye Hazır mısın?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              500+ markaya katıl ve AI gücüyle içerik üretimini hızlandır.
              <br className="hidden md:block" />
              <span className="text-gray-500">İlk video ücretsiz, kredi kartı gerekmez.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(0,217,255,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0,217,255,0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Kurulum gerektirmez</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>7/24 Destek</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>İstediğin zaman iptal</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-xl font-bold text-text-primary">InfluencerSeninle</span>
              </div>
              <p className="text-text-secondary">
                Modern influencer'lar için AI destekli video içerik üretim platformu.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4">Ürün</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#features" className="hover:text-neon-cyan transition-colors">Özellikler</a></li>
                <li><a href="#pricing" className="hover:text-neon-cyan transition-colors">Fiyatlandırma</a></li>
                <li><a href="#sectors" className="hover:text-neon-cyan transition-colors">Sektörler</a></li>
                <li><a href="#comparison" className="hover:text-neon-cyan transition-colors">Karşılaştırma</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4">Kaynaklar</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Dokümantasyon</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Vaka Çalışmaları</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Destek</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-4">Şirket</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Gizlilik</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Şartlar</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm">
              © 2026 InfluencerSeninle. Tüm hakları saklıdır.
            </p>
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
