import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GizlilikPolitikasiProps {
  onBack: () => void;
}

export default function GizlilikPolitikasi({ onBack }: GizlilikPolitikasiProps) {
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
        <h1 className="text-4xl font-bold text-white mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">Son güncelleme: 12 Şubat 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Giriş</h2>
            <p className="text-gray-300 leading-relaxed">
              InfluencerSeninle ("Şirket", "biz", "bizim") olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. 
              Bu Gizlilik Politikası, hizmetlerimizi kullandığınızda kişisel verilerinizi nasıl topladığımızı, 
              kullandığımızı ve koruduğumuzu açıklamaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Toplanan Veriler</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Aşağıdaki kişisel verileri toplayabiliriz:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Ad, soyad ve e-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Ödeme bilgileri (kredi kartı bilgileri üçüncü parti ödeme işlemcileri tarafından işlenir)</li>
              <li>Yüklenen ürün fotoğrafları ve videoları</li>
              <li>Kullanım istatistikleri ve tercihler</li>
              <li>IP adresi ve cihaz bilgileri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Verilerin Kullanımı</h2>
            <p className="text-gray-300 leading-relaxed mb-4">Toplanan verileri şu amaçlarla kullanıyoruz:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Hizmetlerimizi sunmak ve geliştirmek</li>
              <li>AI destekli video içerikleri oluşturmak</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Ödeme işlemlerini gerçekleştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Veri Güvenliği</h2>
            <p className="text-gray-300 leading-relaxed">
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Tüm veri aktarımları 
              SSL/TLS şifreleme ile korunmaktadır. Verileriniz güvenli sunucularda saklanmakta ve 
              yetkisiz erişime karşı korunmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Üçüncü Taraflarla Paylaşım</h2>
            <p className="text-gray-300 leading-relaxed">
              Kişisel verilerinizi, hizmet sağlayıcılarımız (ödeme işlemcileri, bulut hizmetleri) dışında 
              üçüncü taraflarla paylaşmıyoruz. Yasal zorunluluk durumlarında yetkili makamlarla 
              paylaşım yapılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Haklarınız</h2>
            <p className="text-gray-300 leading-relaxed mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Verilerinize erişim hakkı</li>
              <li>Verilerin düzeltilmesini isteme hakkı</li>
              <li>Verilerin silinmesini isteme hakkı</li>
              <li>Veri işlemeye itiraz hakkı</li>
              <li>Veri taşınabilirliği hakkı</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. İletişim</h2>
            <p className="text-gray-300 leading-relaxed">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:<br />
              E-posta: destek@influencerseninle.com<br />
              Adres: İstanbul, Türkiye
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
