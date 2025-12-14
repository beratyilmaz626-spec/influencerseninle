import { useState } from 'react';
import { Play, Sparkles, Zap, Video, ArrowRight, CheckCircle2, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthModal from './AuthModal';
import { VideoSlider } from '@/components/ui/video-slider';
import { Pricing } from '@/components/ui/pricing';

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

  // Karşılaştırma verileri
  const comparisonData = [
    { feature: 'İçerik Üretim Hızı', us: 'Tek tıkla, gerçek zamanlı', them: 'Günler, hatta haftalar' },
    { feature: 'Maliyet', us: 'Aylık düşük abonelik', them: 'Yüksek prodüksiyon + influencer ücretleri' },
    { feature: 'Lojistik & Set Yönetimi', us: true, them: false },
    { feature: 'Kargo & Ürün Gönderimi', us: true, them: false },
    { feature: 'Risk Faktörleri', us: 'Sıfır risk - Her zaman hazır', them: 'İptal, influencer bulunamama' },
    { feature: 'Revizyon İmkanı', us: 'İstediğin kadar, sınırsız', them: 'Sınırlı, ekstra ücret' },
    { feature: 'İçerik Çeşitliliği', us: 'Tek üründen yüzlerce varyasyon', them: 'Her seferinde yeni çekim' },
    { feature: 'Yönetim', us: '100% dijital, uzaktan', them: 'Fiziksel koordinasyon, toplantılar' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-glass bg-background/80">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
              </div>
              <div className="text-xl font-bold">
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
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-8"
            >
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-text-secondary">AI Destekli Video Platformu</span>
              <Badge variant="success">YENİ</Badge>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">Muhteşem Videolar</span>
              <br />
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                AI Teknolojisi ile Oluşturun
              </span>
            </motion.h1>
            
            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Fikirlerinizi saniyeler içinde profesyonel kalitede videolara dönüştürün. 
              Düzenleme becerisi gerektirmez.
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                variant="premium"
                onClick={() => setShowAuthModal(true)}
                className="group"
              >
                <span>Video Oluştur</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAuthModal(true)}
              >
                <Video className="w-5 h-5 mr-2" />
                <span>Demo İzle</span>
              </Button>
            </motion.div>
            
            {/* Video Slider Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-20 max-w-6xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative h-[500px] glass-card rounded-3xl overflow-hidden">
                  <VideoSlider />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biz vs Onlar - Karşılaştırma Bölümü */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
            >
              🎯 Biz vs Onlar
            </motion.h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              AI tabanlı UGC ile geleneksel yöntemler arasındaki <span className="font-bold text-neon-cyan">devasa fark</span>
            </p>
          </div>

          {/* Karşılaştırma Tablosu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-5 text-left text-base font-bold text-text-primary w-1/3"></th>
                    <th className="px-6 py-5 text-center w-1/3 bg-neon-green/10">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 mb-2 text-neon-green" />
                        <span className="text-lg font-bold text-neon-green">InfluencerSeninle</span>
                        <span className="text-xs font-normal text-text-secondary mt-1">AI Tabanlı UGC</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center w-1/3 bg-neon-pink/10">
                      <div className="flex flex-col items-center">
                        <X className="w-8 h-8 mb-2 text-neon-pink" />
                        <span className="text-lg font-bold text-neon-pink">Geleneksel</span>
                        <span className="text-xs font-normal text-text-secondary mt-1">Ajanslar, Diğer Araçlar</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border/50 transition-all hover:bg-white/5 ${
                        index % 2 === 0 ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 bg-neon-green/5 border-l border-r border-neon-green/20">
                        <div className="flex justify-center items-center">
                          {typeof row.us === 'boolean' ? (
                            <div className="flex flex-col items-center space-y-1">
                              <CheckCircle2 className="w-6 h-6 text-neon-green" />
                              <span className="text-xs font-semibold text-neon-green">✓ Sıfır</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-neon-green text-center">{row.us}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-neon-pink/5">
                        <div className="flex justify-center items-center">
                          {typeof row.them === 'boolean' ? (
                            <div className="flex flex-col items-center space-y-1">
                              <X className="w-6 h-6 text-neon-pink" />
                              <span className="text-xs font-semibold text-neon-pink">✗ Gerekli</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-neon-pink text-center">{row.them}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  name: "Başlangıç",
                  price: "9.90",
                  yearlyPrice: "9.90",
                  period: "",
                  features: [
                    "20 adet HD kalite video",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Temel şablonlar",
                    "E-posta desteği",
                  ],
                  description: "Tek seferlik ödeme ile 20 adet HD kalite video",
                  buttonText: "Planı Seç",
                  priceId: "price_1SI8r5IXoILZ7benDrZEtPLb",
                  isPopular: false,
                },
                {
                  name: "Profesyonel",
                  price: "19.90",
                  yearlyPrice: "19.90",
                  period: "",
                  features: [
                    "45 adet HD kalite video",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Premium şablonlar",
                    "Öncelikli destek",
                    "API erişimi",
                  ],
                  description: "Tek seferlik ödeme ile 45 adet HD kalite video",
                  buttonText: "Planı Seç",
                  priceId: "price_1SI93eIXoILZ7benaTtahoH7",
                  isPopular: true,
                },
                {
                  name: "Kurumsal",
                  price: "39.90",
                  yearlyPrice: "39.90",
                  period: "",
                  features: [
                    "100 adet HD kalite video",
                    "HD 1080p dışa aktarma",
                    "Filigransız videolar",
                    "Premium şablonlar",
                    "Özel destek",
                    "Gelişmiş API",
                    "Beyaz etiket seçeneği",
                  ],
                  description: "Tek seferlik ödeme ile 100 adet HD kalite video",
                  buttonText: "Planı Seç",
                  priceId: "price_1SI995IXoILZ7benbXtYoVJb",
                  isPopular: false,
                },
              ]}
              title="Uygun, Şeffaf Fiyatlandırma"
              description="İhtiyaçlarınıza uygun planı seçin&#10;Tüm planlar platformumuza erişim, video oluşturma araçları ve özel destek içerir."
              setShowAuthModal={setShowAuthModal}
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Farkı Kendiniz Görün */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              🚀 Farkı Kendiniz Görün
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              AI kullanarak muhteşem videolar oluşturan binlerce içerik üreticisine katılın. 
              Video reklam üretiminizi hızlandırın ve maliyetlerinizi düşürün.
            </p>
            <Button 
              size="lg" 
              variant="premium"
              onClick={() => setShowAuthModal(true)}
              className="group"
            >
              <span>Ücretsiz Deneme Başlat</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
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
              © 2025 InfluencerSeninle. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-text-secondary hover:text-neon-cyan transition-colors">Twitter</a>
              <a href="#" className="text-text-secondary hover:text-neon-cyan transition-colors">LinkedIn</a>
              <a href="#" className="text-text-secondary hover:text-neon-cyan transition-colors">YouTube</a>
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
