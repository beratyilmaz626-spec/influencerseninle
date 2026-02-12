import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KullanimSartlariProps {
  onBack: () => void;
}

export default function KullanimSartlari({ onBack }: KullanimSartlariProps) {
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
        <h1 className="text-4xl font-bold text-white mb-8">Kullanım Şartları</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">Son güncelleme: 12 Şubat 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Kabul</h2>
            <p className="text-gray-300 leading-relaxed">
              InfluencerSeninle platformunu kullanarak bu kullanım şartlarını kabul etmiş olursunuz. 
              Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayınız.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Hizmet Tanımı</h2>
            <p className="text-gray-300 leading-relaxed">
              InfluencerSeninle, yapay zeka teknolojisi kullanarak ürün tanıtım videoları oluşturan 
              bir platformdur. Kullanıcılar ürün fotoğraflarını yükleyerek AI destekli UGC 
              (User Generated Content) videoları oluşturabilirler.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Hesap Oluşturma</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Hesap oluştururken:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Doğru ve güncel bilgiler sağlamalısınız</li>
              <li>Hesap güvenliğinden siz sorumlusunuz</li>
              <li>18 yaşından büyük olmalısınız</li>
              <li>Bir kişi yalnızca bir hesap açabilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Kullanım Kuralları</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Platformumuzu kullanırken şunları yapmayı kabul edersiniz:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Yalnızca yasal ürünler için video oluşturmak</li>
              <li>Telif hakkı ihlali yapmamak</li>
              <li>Platformu kötüye kullanmamak</li>
              <li>Diğer kullanıcıların haklarına saygı göstermek</li>
              <li>Yanıltıcı veya sahte içerik oluşturmamak</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Ödeme ve Abonelik</h2>
            <p className="text-gray-300 leading-relaxed">
              Ücretli hizmetlerimiz için ödeme yapmanız gerekmektedir. Abonelikler otomatik olarak yenilenir. 
              İptal işlemleri dönem sonuna kadar geçerli olur. İade politikamız ayrıca belirtilmiştir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Fikri Mülkiyet</h2>
            <p className="text-gray-300 leading-relaxed">
              Platform üzerinde oluşturulan videolar üzerindeki kullanım hakları size aittir. 
              Ancak, platformumuzun teknolojisi, tasarımı ve içeriği InfluencerSeninle'nin 
              fikri mülkiyetidir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Sorumluluk Sınırı</h2>
            <p className="text-gray-300 leading-relaxed">
              InfluencerSeninle, hizmetlerin kesintisiz veya hatasız olacağını garanti etmez. 
              Dolaylı, özel veya cezai zararlardan sorumlu değiliz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Değişiklikler</h2>
            <p className="text-gray-300 leading-relaxed">
              Bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkımızı saklı tutarız. 
              Değişiklikler web sitemizde yayınlandığı anda yürürlüğe girer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. İletişim</h2>
            <p className="text-gray-300 leading-relaxed">
              Sorularınız için: destek@influencerseninle.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
