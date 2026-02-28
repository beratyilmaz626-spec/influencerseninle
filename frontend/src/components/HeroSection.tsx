import { Sparkles, ArrowRight, Zap, Star, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-0">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-neon-cyan" />
            <span className="text-xs sm:text-sm font-semibold text-gray-300">
              Türkiye'nin #1 AI UGC Platformu
            </span>
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 sm:mb-8 animate-fade-in-up">
          <span className="text-white">Yapay Zeka ile</span>
          <br />
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            UGC Video
          </span>
          <span className="text-white"> Üret</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 animate-fade-in-up delay-100 px-2">
          Ürün fotoğraflarınızı <span className="text-neon-cyan font-semibold">profesyonel UGC videolara</span> dönüştürün.
          <br className="hidden md:block" />
          <span className="text-gray-500">Influencer aramadan, stüdyo kurmadan, dakikalar içinde.</span>
        </p>

        {/* CTA Button - Centered */}
        <div className="flex items-center justify-center mb-10 sm:mb-16 animate-fade-in-up delay-200">
          <button
            onClick={onGetStarted}
            className="group px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-base sm:text-lg md:text-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-neon-cyan/30"
          >
            <span className="flex items-center justify-center gap-2 sm:gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              Ücretsiz Başla
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-gray-500 text-xs sm:text-sm animate-fade-in delay-300 px-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400" />
            <span>500+ Aktif Kullanıcı</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-2">
            <span>10.000+ Video Üretildi</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-2">
            <span>%99.9 Müşteri Memnuniyeti</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce"
        onClick={() => document.getElementById('difference')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Keşfet</span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}</style>
    </section>
  );
}
