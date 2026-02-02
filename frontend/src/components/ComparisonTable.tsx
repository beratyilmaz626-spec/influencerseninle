import { CheckCircle2, XCircle, Sparkles, Zap, Shield, Palette, Clock, DollarSign, Package, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

// Comparison data with icons
const comparisonData = [
  { 
    feature: 'İçerik Üretim Hızı', 
    icon: Clock,
    us: '24-48 Saat', 
    them: '2-4 Hafta',
    usDetail: 'Anında sonuç',
    themDetail: 'Uzun süreçler'
  },
  { 
    feature: 'Maliyet', 
    icon: DollarSign,
    us: '%70 Daha Uygun', 
    them: 'Yüksek Ücretler',
    usDetail: '₺949-8.549/ay',
    themDetail: 'Binlerce TL'
  },
  { 
    feature: 'Lojistik & Kargo', 
    icon: Package,
    us: 'Otomatik Süreç', 
    them: 'Manuel Takip',
    usDetail: 'Sıfır lojistik',
    themDetail: 'Ürün gönderimi'
  },
  { 
    feature: 'Risk Faktörleri', 
    icon: Shield,
    us: 'Garantili Teslimat', 
    them: 'Belirsiz Sonuç',
    usDetail: 'Her zaman hazır',
    themDetail: 'İptal riski'
  },
  { 
    feature: 'Revizyon İmkanı', 
    icon: RefreshCcw,
    us: 'Sınırsız Revizyon', 
    them: 'Ekstra Ücret',
    usDetail: 'İstediğin kadar',
    themDetail: 'Sınırlı haklar'
  },
  { 
    feature: 'İçerik Çeşitliliği', 
    icon: Palette,
    us: 'Sınırsız Varyasyon', 
    them: 'Tek Çekim',
    usDetail: 'Yüzlerce stil',
    themDetail: 'Standart içerik'
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function ComparisonTable() {
  return (
    <section 
      id="comparison" 
      className="relative py-24 md:py-32 overflow-hidden"
      data-testid="comparison-section"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">Farkı Gör</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Neden <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">Biz?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Geleneksel yöntemlerle AI tabanlı UGC arasındaki <span className="text-neon-cyan font-semibold">devasa farkı</span> keşfet
          </p>
        </motion.div>

        {/* Comparison Cards Container */}
        <motion.div 
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          data-testid="comparison-table"
        >
          {/* Desktop/Tablet Header */}
          <motion.div 
            className="hidden md:grid grid-cols-7 gap-4 mb-6"
            variants={rowVariants}
          >
            <div className="col-span-3" />
            <div className="col-span-2 text-center">
              <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  InfluencerSeninle
                </span>
                <span className="text-xs text-text-muted mt-1">AI Tabanlı UGC</span>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-surface/50 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-xl font-bold text-red-400">
                  Geleneksel
                </span>
                <span className="text-xs text-text-muted mt-1">Ajanslar & Diğer Araçlar</span>
              </div>
            </div>
          </motion.div>

          {/* Comparison Rows */}
          <div className="space-y-3 md:space-y-4">
            {comparisonData.map((row, index) => {
              const IconComponent = row.icon;
              return (
                <motion.div
                  key={index}
                  variants={rowVariants}
                  data-testid={`comparison-row-${index}`}
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
            variants={rowVariants}
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
              <a 
                href="#pricing"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
              >
                Planları İncele
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Export for backwards compatibility
export { comparisonData as DEFAULT_COMPARISON_DATA };
