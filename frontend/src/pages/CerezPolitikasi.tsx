import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CerezPolitikasiProps {
  onBack: () => void;
}

export default function CerezPolitikasi({ onBack }: CerezPolitikasiProps) {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#030712]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Çerez Politikası</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">Son güncelleme: 12 Şubat 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Çerez Nedir?</h2>
            <p className="text-gray-300 leading-relaxed">
              Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. 
              Bu dosyalar, sizi tanımamıza ve deneyiminizi kişiselleştirmemize yardımcı olur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Kullandığımız Çerez Türleri</h2>
            
            <h3 className="text-xl font-semibold text-neon-cyan mt-6 mb-3">Zorunlu Çerezler</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Web sitemizin temel işlevleri için gereklidir. Oturum yönetimi ve güvenlik için kullanılır.
            </p>

            <h3 className="text-xl font-semibold text-neon-cyan mt-6 mb-3">Performans Çerezleri</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Ziyaretçilerin sitemizi nasıl kullandığını anlamamıza yardımcı olur. Google Analytics kullanıyoruz.
            </p>

            <h3 className="text-xl font-semibold text-neon-cyan mt-6 mb-3">İşlevsellik Çerezleri</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Tercihlerinizi (dil, tema vb.) hatırlamak için kullanılır.
            </p>

            <h3 className="text-xl font-semibold text-neon-cyan mt-6 mb-3">Pazarlama Çerezleri</h3>
            <p className="text-gray-300 leading-relaxed">
              Size özelleştirilmiş reklamlar sunmak için kullanılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Çerezleri Yönetme</h2>
            <p className="text-gray-300 leading-relaxed">
              Tarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Ancak bu durumda 
              bazı site özellikleri düzgün çalışmayabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Üçüncü Taraf Çerezleri</h2>
            <p className="text-gray-300 leading-relaxed">
              Analiz ve pazarlama amaçlı üçüncü taraf hizmetleri (Google Analytics, Facebook Pixel vb.) 
              kendi çerezlerini kullanabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. İletişim</h2>
            <p className="text-gray-300 leading-relaxed">
              Çerez politikamız hakkında sorularınız için: destek@influencerseninle.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
