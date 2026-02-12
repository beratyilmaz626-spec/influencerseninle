import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Play, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface DifferenceSectionProps {
  onGetStarted?: () => void;
}

export default function DifferenceSection({ onGetStarted }: DifferenceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Use video from public folder for better compatibility
  const videoUrl = '/videos/ugc_video_1.mp4';

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      x.set(width * 0.5);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        const currentPercent = x.get() / containerWidth;
        x.set(width * currentPercent);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerWidth]);

  const handleDrag = (event: any, info: any) => {
    const newX = Math.max(0, Math.min(containerWidth, x.get() + info.delta.x));
    x.set(newX);
  };

  const clipPath = useTransform(springX, (value) => {
    const percent = containerWidth > 0 ? (value / containerWidth) * 100 : 50;
    return `inset(0 ${100 - percent}% 0 0)`;
  });

  const sliderPosition = useTransform(springX, (value) => {
    return containerWidth > 0 ? (value / containerWidth) * 100 : 50;
  });

  return (
    <section 
      id="difference" 
      className="relative py-20 md:py-32 overflow-hidden bg-[#030712]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Farkı <span className="text-neon-cyan">Kendiniz</span> Görün
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Sıradan ürün fotoğrafından etkileyici UGC videoya dönüşüm
          </motion.p>
        </div>

        {/* Comparison Slider */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Animated border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl opacity-30" />
          
          {/* Main container */}
          <div 
            ref={containerRef}
            className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none touch-none"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
          >
            <div className="absolute inset-[2px] rounded-3xl overflow-hidden bg-[#0a0f1a]">
              {/* After - UGC Video (base layer - shows on LEFT) */}
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/product-before.jpeg"
                  onLoadedData={() => setVideoLoaded(true)}
                  onCanPlay={() => setVideoLoaded(true)}
                  onError={(e) => console.log('DifferenceSection video error:', e)}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
                
                {/* Fallback gradient if video fails */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/30 -z-10" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* After Label - LEFT side */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="px-4 py-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/30 inline-block">
                    <span className="text-sm md:text-base font-semibold text-neon-cyan">
                      🔥 AI UGC Video
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs md:text-sm mt-2">
                    %300+ etkileşim artışı
                  </p>
                </div>

                {/* Sound toggle */}
                <button
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                    }
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-neon-cyan" />
                  )}
                </button>
              </div>

              {/* Before - Product Photo (clipped layer - shows on RIGHT) */}
              <motion.div 
                className="absolute inset-0"
                style={{ clipPath }}
              >
                <img 
                  src="/images/product-before.jpeg" 
                  alt="Ürün Fotoğrafı" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Before Label - RIGHT side */}
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-right">
                  <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
                    <span className="text-sm md:text-base font-semibold text-red-400">
                      📸 Sıradan Fotoğraf
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">
                    Düşük etkileşim
                  </p>
                </div>
              </motion.div>

              {/* Slider Handle */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-30 cursor-ew-resize"
                style={{ left: sliderPosition.get() + '%', x: '-50%' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                onDrag={handleDrag}
              >
                {/* Handle circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="flex items-center gap-0.5">
                    <div className="w-0.5 h-4 bg-gray-400 rounded" />
                    <div className="w-0.5 h-4 bg-gray-400 rounded" />
                  </div>
                </div>
                
                {/* Drag hint */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-gray-400 font-medium">← Kaydır →</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg shadow-lg hover:shadow-neon-cyan/30 transition-shadow"
          >
            <Play className="w-5 h-5" />
            Hemen Deneyin
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
