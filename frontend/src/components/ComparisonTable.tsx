import { CheckCircle2, X } from 'lucide-react';

interface ComparisonData {
  feature: string;
  reklamDeha: string | boolean;
  others: string | boolean;
}

const comparisonData: ComparisonData[] = [
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
                      <span>reklamDeha</span>
                      <span className="text-xs font-normal text-gray-600 mt-1">AI Tabanlı UGC</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold text-red-600 w-1/3 bg-red-50/80">
                    <div className="flex flex-col items-center">
                      <X className="w-8 h-8 mb-2 text-red-500" />
                      <span>Geleneksel Yöntemler</span>
                      <span className="text-xs font-normal text-gray-600 mt-1">Ajanslar, Diğer Yapay Zeka Araçları, Kendi Başına</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
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

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Farkı Kendiniz Görün
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              ReklamDeha ile video reklam üretiminizi hızlandırın ve maliyetlerinizi düşürün
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2 shadow-lg">
              <span>Ücretsiz Deneme Başlat</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}