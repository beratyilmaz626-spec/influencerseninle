import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Volume2, VolumeX, Image, Video } from 'lucide-react';

interface DifferenceSectionProps {
  onGetStarted?: () => void;
}

export default function DifferenceSection({ onGetStarted }: DifferenceSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Use video from public folder
  const videoUrl = '/videos/ugc_video_2.mp4';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section 
      id="difference" 
      className="relative py-20 md:py-32 overflow-hidden bg-[#030712]"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="text-neon-cyan text-sm font-medium">✨ PROJELER</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Fotoğraf Ürününden <span className="text-neon-cyan">UGC Videoya</span>
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Sadece ürün fotoğrafınızı yükleyin, gerçek insanlarla profesyonel UGC videoları oluşturun.
          </motion.p>
        </div>

        {/* Before/After Comparison - Side by Side */}
        <motion.div 
          className="relative max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            
            {/* BEFORE - Product Photo */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Label */}
              <div className="absolute -top-3 left-4 z-20">
                <div className="px-4 py-1.5 rounded-full bg-gray-900 border border-white/20 shadow-lg">
                  <span className="text-sm font-bold text-white">ÖNCE</span>
                </div>
              </div>
              
              {/* Card */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                {/* Product Image */}
                <div className="aspect-[4/5] relative bg-gray-50">
                  <img 
                    src="/images/ruj-product.jpeg" 
                    alt="Ürün Fotoğrafı" 
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-white">
                  <Image className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Ürün Fotoğrafı</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gray-200 rounded-full blur-2xl opacity-50" />
            </motion.div>

            {/* Arrow indicator for desktop */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg shadow-neon-cyan/30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            {/* Mobile arrow */}
            <div className="flex lg:hidden justify-center -my-2">
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg rotate-90"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* AFTER - UGC Video */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Label */}
              <div className="absolute -top-3 left-4 z-20">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan shadow-lg">
                  <span className="text-sm font-bold text-white">SONRASINDA</span>
                </div>
              </div>
              
              {/* Card with glow */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl opacity-40 blur-lg group-hover:opacity-60 transition-opacity" />
                
                {/* Video container */}
                <div className="relative bg-[#0a0f1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  {/* Video */}
                  <div className="aspect-[4/5] relative">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                    
                    {/* Video overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Sound toggle */}
                    <button
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/70 transition-all z-20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-neon-cyan" />
                      )}
                    </button>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 flex items-center gap-2 bg-[#0a0f1a]">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
                      <Video className="w-4 h-4 text-neon-cyan" />
                      <span className="text-sm text-neon-cyan font-medium">UGC Video</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-neon-purple/30 rounded-full blur-2xl" />
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div 
            className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl md:text-3xl font-black text-neon-cyan mb-1">%300+</div>
              <div className="text-xs md:text-sm text-gray-400">Etkileşim Artışı</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl md:text-3xl font-black text-neon-purple mb-1">2 dk</div>
              <div className="text-xs md:text-sm text-gray-400">Video Üretim</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl md:text-3xl font-black text-neon-pink mb-1">%90</div>
              <div className="text-xs md:text-sm text-gray-400">Maliyet Tasarrufu</div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg shadow-lg hover:shadow-neon-cyan/40 transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Hemen Deneyin
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
