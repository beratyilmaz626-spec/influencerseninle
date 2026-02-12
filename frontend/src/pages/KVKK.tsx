import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KVKKProps {
  onBack: () => void;
}

export default function KVKK({ onBack }: KVKKProps) {
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
        <h1 className="text-4xl font-bold text-white mb-8">KVKK Aydınlatma Metni</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">Son güncelleme: 12 Şubat 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Veri Sorumlusu</h2>
            <p className="text-gray-300 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, InfluencerSeninle olarak 
              veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında işleyebileceğimizi 
              bildiririz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. İşlenen Kişisel Veriler</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası</li>
              <li><strong>Finansal Bilgiler:</strong> Fatura bilgileri, ödeme geçmişi</li>
              <li><strong>Görsel Veriler:</strong> Yüklenen ürün fotoğrafları</li>
              <li><strong>İşlem Güvenliği:</strong> IP adresi, oturum bilgileri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. İşleme Amaçları</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Hizmetlerin sunulması ve sözleşmenin ifası</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Müşteri ilişkileri yönetimi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin artırılması</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Veri İşleme Şartları</h2>
            <p className="text-gray-300 leading-relaxed">
              Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen şartlara uygun olarak işlenmektedir. 
              Açık rızanız alınması gereken hallerde rızanız talep edilmektedir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Veri Aktarımı</h2>
            <p className="text-gray-300 leading-relaxed">
              Kişisel verileriniz, hizmet sağlayıcılarımıza (bulut hizmetleri, ödeme işlemcileri) ve 
              yasal zorunluluk hallerinde yetkili kamu kurum ve kuruluşlarına aktarılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. KVKK Kapsamındaki Haklarınız</h2>
            <p className="text-gray-300 leading-relaxed mb-4">KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Başvuru Yöntemi</h2>
            <p className="text-gray-300 leading-relaxed">
              Haklarınızı kullanmak için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:<br /><br />
              <strong>E-posta:</strong> influencerseninle@gmail.com<br />
              <strong>Adres:</strong> Ankara, Türkiye<br /><br />
              Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
