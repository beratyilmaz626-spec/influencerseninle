import { CheckCircle2, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Exported interfaces for reusability
export interface ComparisonRow {
  feature: string;
  us: string | boolean;
  them: string | boolean;
}

// Re-export for backwards compatibility
export interface ComparisonData {
  feature: string;
  reklamDeha: string | boolean;
  others: string | boolean;
}

// Default comparison data (can be imported and used elsewhere)
export const DEFAULT_COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'İçerik Üretim Hızı', us: 'Tek tıkla, gerçek zamanlı', them: 'Günler, hatta haftalar' },
  { feature: 'Maliyet', us: '$10-40/ay ile sınırsız', them: 'Yüksek prodüksiyon + influencer ücretleri' },
  { feature: 'Lojistik & Set Yönetimi', us: true, them: false },
  { feature: 'Kargo & Ürün Gönderimi', us: true, them: false },
  { feature: 'Risk Faktörleri', us: 'Sıfır risk - Her zaman hazır', them: 'İptal, influencer bulunamama' },
  { feature: 'Revizyon İmkanı', us: 'İstediğin kadar, sınırsız', them: 'Sınırlı, ekstra ücret' },
  { feature: 'İçerik Çeşitliliği', us: 'Tek üründen yüzlerce varyasyon', them: 'Her seferinde yeni çekim' },
  { feature: 'Yönetim', us: '100% dijital, uzaktan', them: 'Fiziksel koordinasyon, toplantılar' }
];

// Props interface for customizable ComparisonTable
export interface ComparisonTableProps {
  data?: ComparisonRow[];
  usTitle?: string;
  themTitle?: string;
  theme?: 'dark' | 'light';
  className?: string;
  showCTA?: boolean;
  onCTAClick?: () => void;
}

// Legacy data format (for backwards compatibility)
const legacyComparisonData: ComparisonData[] = [
  {
    feature: 'İçerik Üretim Hızı',
    reklamDeha: 'Tek tıkla, gerçek zamanlı',
    others: 'Günler, hatta haftalar'
  },
  {
    feature: 'Maliyet',
    reklamDeha: 'Aylık düşük abonelik',
    others: 'Yüksek prodüksiyon + influencer ücretleri'
  },
  {
    feature: 'Lojistik & Set Yönetimi',
    reklamDeha: true,
    others: false
  },
  {
    feature: 'Kargo & Ürün Gönderimi',
    reklamDeha: true,
    others: false
  },
  {
    feature: 'Risk Faktörleri',
    reklamDeha: 'Sıfır risk - Her zaman hazır',
    others: 'İptal, influencer bulunamama, hava durumu'
  },
  {
    feature: 'Revizyon İmkanı',
    reklamDeha: 'İstediğin kadar, sınırsız',
    others: 'Sınırlı, ekstra ücret gerektirebilir'
  },
  {
    feature: 'İçerik Çeşitliliği',
    reklamDeha: 'Tek üründen yüzlerce varyasyon',
    others: 'Her seferinde yeni çekim gerekir'
  },
  {
    feature: 'Yönetim Şekli',
    reklamDeha: '100% dijital, uzaktan',
    others: 'Fiziksel koordinasyon, toplantılar, set yönetimi'
  }
];

// Helper function to render cell values (exported for reuse)
export function renderComparisonValue(value: string | boolean, isPositive: boolean, theme: 'dark' | 'light' = 'dark') {
  if (typeof value === 'boolean') {
    return value ? (
      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        theme === 'dark' 
          ? (isPositive ? 'bg-neon-cyan/20' : 'bg-red-500/20')
          : (isPositive ? 'bg-green-100' : 'bg-red-100')
      }`}>
        {value ? (
          <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${
            theme === 'dark' ? 'text-neon-cyan' : 'text-green-600'
          }`} />
        ) : (
          <X className={`w-3 h-3 sm:w-4 sm:h-4 ${
            theme === 'dark' ? 'text-red-500' : 'text-red-600'
          }`} />
        )}
      </div>
    ) : (
      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
      }`}>
        <X className={`w-3 h-3 sm:w-4 sm:h-4 ${
          theme === 'dark' ? 'text-red-500' : 'text-red-600'
        }`} />
      </div>
    );
  }
  return (
    <span className={`text-xs sm:text-sm ${
      theme === 'dark'
        ? (isPositive ? 'text-neon-cyan' : 'text-red-400')
        : (isPositive ? 'text-green-700' : 'text-red-700')
    }`}>
      {value}
    </span>
  );
}

// Dark theme comparison table (for Landing Page)
export function DarkComparisonTable({ 
  data = DEFAULT_COMPARISON_DATA, 
  usTitle = 'InfluencerSeninle',
  themTitle = 'Geleneksel',
  className = ''
}: ComparisonTableProps) {
  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-text-secondary font-medium text-sm sm:text-base">
                Özellik
              </th>
              <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  {usTitle}
                </span>
              </th>
              <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">
                <span className="text-base sm:text-lg font-bold text-neon-pink">
                  {themTitle}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="border-b border-border/50 hover:bg-surface-elevated/30 transition-colors"
              >
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-text-primary font-medium text-sm sm:text-base">
                  {row.feature}
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-center">
                  {renderComparisonValue(row.us, true, 'dark')}
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-6 text-center">
                  {renderComparisonValue(row.them, false, 'dark')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-3 gap-2 px-2 py-3 rounded-xl bg-surface-elevated/50 border border-border">
          <div className="text-xs text-text-secondary font-medium">Özellik</div>
          <div className="text-center">
            <span className="text-xs font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              {usTitle}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-neon-pink">{themTitle}</span>
          </div>
        </div>

        {data.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-2 px-3 py-3 rounded-xl bg-surface/50 border border-border/30 items-center"
          >
            <div className="text-xs text-text-primary font-medium leading-tight">
              {row.feature}
            </div>
            <div className="flex justify-center">
              {renderComparisonValue(row.us, true, 'dark')}
            </div>
            <div className="flex justify-center">
              {renderComparisonValue(row.them, false, 'dark')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Default export - Light theme (legacy, backwards compatible)
export default function ComparisonTable() {
  const renderCell = (value: string | boolean, isPositive: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <span className="text-sm font-semibold text-green-700">✓ Sıfır</span>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <X className="w-8 h-8 text-red-500" />
          <span className="text-sm font-semibold text-red-700">✗ Gerekli</span>
        </div>
      );
    }
    
    return (
      <span className={`text-center block text-sm font-semibold whitespace-pre-line ${
        isPositive ? 'text-green-700' : 'text-red-700'
      }`}>
        {value}
      </span>
    );
  };

  return (
    <section id="comparison" className="py-24 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎯 Biz vs Onlar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI tabanlı UGC ile geleneksel yöntemler arasındaki <span className="font-bold text-blue-600">devasa fark</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-gray-200">
                  <th className="px-8 py-6 text-left text-base font-bold text-gray-800 w-1/3">
                    
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold text-green-600 w-1/3 bg-green-50/80">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                      <span>InfluencerSeninle</span>
                      <span className="text-xs font-normal text-gray-600 mt-1">AI Tabanlı UGC</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold text-red-600 w-1/3 bg-red-50/80">
                    <div className="flex flex-col items-center">
                      <X className="w-8 h-8 mb-2 text-red-500" />
                      <span>Geleneksel Yöntemler</span>
                      <span className="text-xs font-normal text-gray-600 mt-1">Ajanslar, Diğer Yapay Zeka Araçları</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {legacyComparisonData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 transition-all hover:shadow-md ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-8 py-5 bg-green-50/30 border-l-2 border-r-2 border-green-100">
                      <div className="flex justify-center items-center min-h-[60px]">
                        {renderCell(row.reklamDeha, true)}
                      </div>
                    </td>
                    <td className="px-8 py-5 bg-red-50/20">
                      <div className="flex justify-center items-center min-h-[60px]">
                        {renderCell(row.others, false)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}