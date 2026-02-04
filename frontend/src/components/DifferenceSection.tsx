import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, ArrowRight, Zap, MousePointer2 } from 'lucide-react';

interface DifferenceSectionProps {
  onGetStarted?: () => void;
}

export default function DifferenceSection({ onGetStarted }: DifferenceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const x = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const clipPath = useTransform(springX, [0, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    x.set(newX);
  };

  return (
    <section 
      id="difference" 
      className="relative py-24 md:py-32 overflow-hidden"
      data-testid="difference-section"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]" />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,217,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,128,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
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
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 mb-8"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,217,255,0.3)' }}
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              AI Gücüyle Dönüşüm
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Farkı{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Kendiniz
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </span>
            {' '}Görün
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Sıradan ürün fotoğraflarından <span className="text-neon-cyan font-semibold">profesyonel UGC videolara</span> dönüşümü keşfedin.
            <br className="hidden md:block" />
            Tek tıkla, saniyeler içinde.
          </p>
        </motion.div>

        {/* Interactive Comparison Slider */}
        <motion.div
          ref={containerRef}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden cursor-ew-resize group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onMouseMove={(e) => isDragging && handleDrag(e)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={handleDrag}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          data-testid="comparison-slider"
        >
          {/* Border glow effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          
          <div className="absolute inset-[2px] rounded-3xl overflow-hidden bg-[#0a0f1a]">
            {/* Before Image (Boring) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
                alt="Sıradan Ürün Fotoğrafı"
                className="w-full h-full object-cover grayscale brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Before Label */}
              <motion.div 
                className="absolute bottom-6 left-6 md:bottom-10 md:left-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                  <span className="text-sm md:text-base font-semibold text-red-400">
                    😴 Sıradan Ürün Fotoğrafı
                  </span>
                </div>
                <p className="text-gray-500 text-xs md:text-sm mt-2 max-w-xs">
                  Düşük etkileşim, düşük dönüşüm oranları
                </p>
              </motion.div>
            </div>

            {/* After - UGC Video */}
            <motion.div 
              className="absolute inset-0"
              style={{ clipPath }}
            >
              {/* Video Element */}
              <video
                src="/api/static/videos/ugc_video_1.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* After Label */}
              <motion.div 
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-right"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="px-4 py-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/30 backdrop-blur-sm inline-block">
                  <span className="text-sm md:text-base font-semibold text-neon-cyan">
                    🔥 AI UGC Video
                  </span>
                </div>
                <p className="text-gray-300 text-xs md:text-sm mt-2 max-w-xs">
                  %300+ etkileşim artışı, yüksek dönüşüm
                </p>
              </motion.div>

              {/* Sound indicator */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
                </div>
              </motion.div>
            </motion.div>

            {/* Slider Handle */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
              style={{ left: useTransform(springX, [0, 1], ['0%', '100%']) }}
            >
              {/* Handle circle */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 text-gray-800 rotate-180" />
                  <ArrowRight className="w-4 h-4 text-gray-800" />
                </div>
              </motion.div>
            </motion.div>

            {/* Drag instruction */}
            <AnimatePresence>
              {!isDragging && (
                <motion.div
                  className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <MousePointer2 className="w-4 h-4 text-white" />
                  <span className="text-xs md:text-sm text-white font-medium">Kaydırarak karşılaştır</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { value: '%300+', label: 'Etkileşim Artışı', color: 'neon-cyan' },
            { value: '10x', label: 'Dönüşüm Oranı', color: 'neon-purple' },
            { value: '24 Saat', label: 'Teslimat Süresi', color: 'neon-pink' },
            { value: '%70', label: 'Maliyet Tasarrufu', color: 'neon-cyan' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className={`absolute -inset-[1px] bg-gradient-to-r from-${stat.color} to-neon-purple rounded-2xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-300`} />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center group-hover:border-white/20 transition-colors">
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r from-${stat.color} to-neon-purple bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,217,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Ücretsiz Dene
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">
            Kredi kartı gerekmez • İlk video ücretsiz
          </p>
        </motion.div>
      </div>
    </section>
  );
}
