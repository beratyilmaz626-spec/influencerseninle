import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowRight, Zap, Star, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Simplified Background - No heavy animations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#030712]" />
        
        {/* Static gradient - no animation */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,217,255,0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.1), transparent),
              radial-gradient(ellipse 50% 30% at 20% 80%, rgba(255,0,128,0.08), transparent)
            `,
          }}
        />

        {/* Static gradient orbs - reduced blur */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(0,217,255,0.15) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-semibold text-gray-300">
              Türkiye'nin #1 AI UGC Platformu
            </span>
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8"
        >
          <span className="text-white">Yapay Zeka ile</span>
          <br />
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            UGC Video
          </span>
          <span className="text-white"> Üret</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Ürün fotoğraflarınızı <span className="text-neon-cyan font-semibold">profesyonel UGC videolara</span> dönüştürün.
          <br className="hidden md:block" />
          <span className="text-gray-500">Influencer aramadan, stüdyo kurmadan, dakikalar içinde.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg shadow-lg hover:shadow-neon-cyan/30 transition-shadow"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Ücretsiz Başla
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-neon-cyan fill-neon-cyan ml-0.5" />
            </div>
            <span>Demo İzle</span>
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
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
        </motion.div>
      </div>

      {/* Scroll indicator - simple CSS animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer animate-bounce"
          onClick={() => document.getElementById('difference')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Keşfet</span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </section>
  );
}
