import { useState } from 'react';
import { Play, Sparkles, Link2, Mic, FileText, Zap, ShoppingBag, TrendingUp, Users, CheckCircle2, ArrowRight, Video, X } from 'lucide-react';
import { TextRotate } from '@/components/ui/text-rotate';
import { LayoutGroup, motion } from 'motion/react';
import { Pricing } from '@/components/ui/pricing';
import { GradientButton } from '@/components/ui/gradient-button';
import { NavBarDemo } from '@/components/ui/tubelight-navbar-demo';
import AuthModal from './AuthModal';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import ComparisonTable from './ComparisonTable';
import { VideoSlider } from '@/components/ui/video-slider';
import { Component as BackgroundGrid } from '@/components/ui/background-snippets';

interface LandingPageProps {
  onGetStarted: () => void;
  onAuthSuccess: () => void;
}

export default function LandingPage({ onGetStarted, onAuthSuccess }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Background Grid Effect */}
      <BackgroundGrid />
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="text-xl text-gray-900">
                <span className="font-bold text-orange-500 transition-colors duration-200 group-hover:text-orange-600">Influencer</span>
                <span className="font-bold text-black transition-colors duration-200 group-hover:text-gray-700">Seninle</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <NavBarDemo />
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-2 rounded-lg font-medium border border-transparent hover:border-gray-200 hover:shadow-md hover:scale-[1.02]"
              >
                Giriş Yap
              </button>
              <GradientButton
               onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Ücretsiz Dene
              </GradientButton>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-gray-900"></span>
                <span className="w-full h-0.5 bg-gray-900"></span>
                <span className="w-full h-0.5 bg-gray-900"></span>
              </div>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#products" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Ürünler</a>
                <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Kullanım Alanları</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Fiyatlandırma</a>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-600 hover:text-gray-900 transition-colors py-2 text-left"
                >
                  Giriş Yap
                </button>
                <GradientButton onClick={() => setShowAuthModal(true)} className="w-full">
                  Ücretsiz Dene
                </GradientButton>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-cyan-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="w-6 h-6 bg-blue-600/20 rounded flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>AI Destekli Video Üretimi</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              Video Reklam Üretimi
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Artık Kolay
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              AI destekli video üretim platformumuz ile saniyeler içinde profesyonel kalitede video reklamlar oluşturun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <GradientButton
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <span>Hemen Başla</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </GradientButton>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 hover:text-blue-600 rounded-xl font-medium transition-all duration-300 inline-flex items-center space-x-2 shadow-md hover:shadow-xl transform hover:scale-105 group"
              >
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Demo İzle</span>
              </button>
            </div>
            
            {/* Video Slider */}
            <div className="mt-16 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <VideoSlider />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-transparent to-cyan-100/30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Ürün Pazarlamanızı Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            AI ile yüksek dönüşümlü video reklamları oluşturan binlerce pazarlamacıya katılın
          </p>
          <GradientButton
            onClick={onGetStarted}
            className="px-10 py-5 text-lg transform hover:scale-110 inline-flex items-center space-x-2 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in group"
            style={{ animationDelay: '0.2s' }}
          >
            <span>İlk Reklamınızı Oluşturun</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </GradientButton>
        </div>
      </section>

      <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Tüm Sektörler İçin <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Akıllı Çözüm</span>
            </h2>
          </div>
          
          <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Bottom Section */}
            <div className="px-8 pb-16 bg-white">
              
              {/* Category Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 max-w-6xl mx-auto">
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🤖</span><span>AI</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-orange-600 hover:to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-orange-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💪</span><span>Fitness</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💻</span><span>Teknoloji</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-green-600 hover:to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-green-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🍎</span><span>Beslenme</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-yellow-600 hover:to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>📈</span><span>Pazarlama</span>
                </button>
                
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-yellow-500 hover:to-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>₿</span><span>Kripto</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-pink-500 hover:to-rose-400 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-pink-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💕</span><span>İlişkiler</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-indigo-600 hover:to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-indigo-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>⚖️</span><span>Hukuk</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-green-600 hover:to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-green-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💰</span><span>Finans</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🛒</span><span>E-ticaret</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-sky-600 hover:to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-sky-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>✈️</span><span>Seyahat</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-emerald-600 hover:to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-emerald-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>👨‍💻</span><span>Geliştirici</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-slate-600 hover:to-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-slate-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🏢</span><span>Kurumsal</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-teal-600 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-teal-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>👔</span><span>Kariyer</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-amber-600 hover:to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-amber-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💼</span><span className="whitespace-nowrap">İş</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-red-600 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-red-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>📊</span><span>Ticaret</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🎮</span><span>Oyun</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-pink-600 hover:to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-pink-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>👶</span><span>Çocuk Ürünleri</span>
                </button>
                
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-600 hover:to-violet-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🔮</span><span>Astroloji</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🗣️</span><span>Dil</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-emerald-600 hover:to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-emerald-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>📚</span><span>Kitaplar</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-pink-600 hover:to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-pink-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💄</span><span>Güzellik</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-red-600 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-red-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🏥</span><span>Medikal</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-600 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💋</span><span>Kozmetik</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-violet-600 hover:to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-violet-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🎨</span><span>Tasarım</span>
                </button>
                
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-green-600 hover:to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-green-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🏘️</span><span>Emlak</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-600 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>👗</span><span>Moda</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-indigo-600 hover:to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-indigo-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🎵</span><span>Müzik</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-teal-600 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-teal-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🌱</span><span>Kişisel Gelişim</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-red-600 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-red-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🏥</span><span>Sağlık</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-green-600 hover:to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-green-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🎓</span><span>Eğitim</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-orange-600 hover:to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-orange-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🍕</span><span>Yemek</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🚗</span><span>Otomotiv</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-600 hover:to-violet-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🎪</span><span>Etkinlik</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-cyan-600 hover:to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-cyan-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🏨</span><span>Otelcilik</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-emerald-600 hover:to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-emerald-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🌿</span><span>Tarım</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-pink-600 hover:to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-pink-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>💍</span><span>Takı</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-indigo-600 hover:to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-indigo-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>📺</span><span>Medya</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-teal-600 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-teal-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>🔧</span><span>Hizmet</span>
                </button>
                <button className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-yellow-600 hover:to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700 hover:border-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span>⚡</span><span>Enerji</span>
                </button>
              </div>

              {/* GIF/Video Slider */}
              <div className="mt-16">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-4 pb-4">
                    {[
                      { emoji: '💄', title: 'Güzellik', color: 'from-pink-500 to-rose-400' },
                      { emoji: '👗', title: 'Moda', color: 'from-purple-500 to-indigo-500' },
                      { emoji: '💪', title: 'Fitness', color: 'from-orange-500 to-red-500' },
                      { emoji: '🍎', title: 'Beslenme', color: 'from-green-500 to-emerald-500' },
                      { emoji: '💻', title: 'Teknoloji', color: 'from-blue-500 to-cyan-500' },
                      { emoji: '🏠', title: 'Emlak', color: 'from-emerald-500 to-teal-500' },
                      { emoji: '🎮', title: 'Oyun', color: 'from-purple-600 to-pink-500' },
                      { emoji: '✈️', title: 'Seyahat', color: 'from-sky-500 to-blue-500' }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                      >
                        {/* Placeholder Gradient Background */}
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
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-900 ml-1" />
                          </div>
                        </div>
                        
                        {/* Badge */}
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                          <span className="text-white text-xs font-semibold">AI Üretimi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Scroll Hint */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                  ← Kaydırarak daha fazla içerik görün →
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
      </section>

      <ComparisonTable />

      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-xl font-bold">InfluencerSeninle</span>
              </div>
              <p className="text-gray-400">
                Modern influencer'lar için AI destekli video içerik üretim platformu.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Entegrasyonlar</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kaynaklar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dokümantasyon</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vaka Çalışmaları</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destek</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Şartlar</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 InfluencerSeninle. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          onAuthSuccess();
        }}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">{title}</h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">{description}</p>
      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 group">
        <span>Daha Fazla Bilgi</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-200" />
      </button>
    </div>
  );
}

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}