import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Camera, Sparkles } from 'lucide-react';

interface VideoOnboardingProps {
  onComplete: () => void;
}

export default function VideoOnboarding({ onComplete }: VideoOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Doğru örnek fotoğraflar (ürün fotoğrafları - temiz arka plan)
  const correctExamples = [
    {
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=400&fit=crop',
      label: 'Kozmetik Ürün'
    },
    {
      url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&h=400&fit=crop',
      label: 'Temiz Arka Plan'
    },
    {
      url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=400&fit=crop',
      label: 'Ürün Odaklı'
    },
    {
      url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=400&fit=crop',
      label: 'Profesyonel Çekim'
    }
  ];

  // Yanlış örnek fotoğraflar (mankenli, karmaşık arka planlı)
  const wrongExamples = [
    {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop',
      label: 'Model İçeren'
    },
    {
      url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop',
      label: 'Mankenli Fotoğraf'
    },
    {
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop',
      label: 'İnsan Yüzlü'
    },
    {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
      label: 'Model Pozlu'
    }
  ];

  const handleComplete = () => {
    // localStorage'a kaydet - kullanıcı onboarding'i gördü
    localStorage.setItem('video_onboarding_completed', 'true');
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/95 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl bg-gradient-to-br from-[#0a0f1a] to-[#111827] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 border-b border-white/10">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl" />
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                  Doğru Fotoğraf Seçimi
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  AI video üretimi için doğru fotoğraf formatını öğrenin
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Warning Box */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-amber-400 font-bold text-base sm:text-lg mb-1">Önemli Uyarı</h3>
                <p className="text-amber-200/80 text-sm sm:text-base">
                  Mankenli veya insan yüzü içeren fotoğraflar kabul edilmez. 
                  Sadece ürün fotoğrafları yükleyiniz.
                </p>
              </div>
            </motion.div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Correct Examples */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-emerald-400 font-bold text-lg">Doğru Örnekler</h3>
                    <p className="text-gray-400 text-sm">Bu tür fotoğrafları yükleyin</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {correctExamples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative group"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-white/5">
                        <img 
                          src={example.url} 
                          alt={example.label}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Check badge */}
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        {/* Label */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-white text-xs sm:text-sm font-medium">{example.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Wrong Examples */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-rose-400 font-bold text-lg">Yanlış Örnekler</h3>
                    <p className="text-gray-400 text-sm">Bu tür fotoğrafları yüklemeyin</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {wrongExamples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative group"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-rose-500/30 bg-white/5 grayscale-[30%]">
                        <img 
                          src={example.url} 
                          alt={example.label}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* X badge */}
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                          <XCircle className="w-4 h-4 text-white" />
                        </div>
                        {/* Diagonal line */}
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="2" />
                          </svg>
                        </div>
                        {/* Label */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-white text-xs sm:text-sm font-medium">{example.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tips */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
                <h4 className="text-white font-bold">İpuçları</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  Beyaz veya düz arka plan tercih edin
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  Ürünü net ve yakın çekin
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  İyi aydınlatma kullanın
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  Yüksek çözünürlüklü fotoğraf seçin
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 border-t border-white/10 bg-white/[0.02]">
            <motion.button
              onClick={handleComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto sm:min-w-[200px] mx-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg shadow-lg shadow-neon-cyan/30 hover:shadow-neon-cyan/50 transition-all"
            >
              <span>Anladım, Devam Et</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
