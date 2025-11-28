import { User, Mail, Building2, Globe, Key, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function ProfileSettings() {
  const { userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    email: userProfile?.email || '',
    company_name: userProfile?.company_name || '',
    country: userProfile?.country || 'Türkiye',
  });

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        company_name: formData.company_name,
        country: formData.country,
      });

      if (error) throw error;
      setMessage('Profil bilgileriniz başarıyla güncellendi!');
    } catch (error) {
      setMessage('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
        <p className="text-gray-600">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şirket Adı
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="İsteğe bağlı"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ülke
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option>Türkiye</option>
                <option>Amerika Birleşik Devletleri</option>
                <option>Birleşik Krallık</option>
                <option>Kanada</option>
                <option>Avustralya</option>
                <option>Almanya</option>
                <option>Fransa</option>
              </select>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              message.includes('başarıyla') 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Güvenlik</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Şifre</p>
                <p className="text-sm text-gray-600">3 ay önce son değiştirildi</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Değiştir
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</p>
                <p className="text-sm text-gray-600">Ekstra güvenlik katmanı ekleyin</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Etkinleştir
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Bildirimler</h2>

        <div className="space-y-4">
          <NotificationToggle
            title="Video Üretimi Tamamlandı"
            description="Videonuz hazır olduğunda bildirim alın"
            defaultChecked={true}
          />
          <NotificationToggle
            title="Krediler Azalıyor"
            description="10'dan az krediniz kaldığında uyarı alın"
            defaultChecked={true}
          />
          <NotificationToggle
            title="Pazarlama Güncellemeleri"
            description="Yeni özellikler ve ipuçları hakkında haberler alın"
            defaultChecked={false}
          />
          <NotificationToggle
            title="Faturalandırma Bildirimleri"
            description="Aboneliğiniz ve ödemeleriniz hakkında güncellemeler"
            defaultChecked={true}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">API Erişimi</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Anahtarı
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="sk_live_••••••••••••••••••••••••"
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                Kopyala
              </button>
              <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                Yeniden Oluştur
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              API anahtarınızı güvende tutun ve asla herkese açık paylaşmayın
            </p>
          </div>

          <button className="text-blue-600 hover:text-blue-700 font-medium">
            API Dokümantasyonunu Görüntüle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ödeme Yöntemleri</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">4242 ile biten Visa</p>
                <p className="text-sm text-gray-600">Son kullanma 12/2026</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                Varsayılan
              </span>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Düzenle
              </button>
            </div>
          </div>

          <button className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Yeni Ödeme Yöntemi Ekle
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-900 mb-2">Tehlike Bölgesi</h2>
        <p className="text-red-700 mb-4">
          Hesabınızı sildikten sonra geri dönüş yoktur. Lütfen emin olun.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Hesabı Sil
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start space-x-3">
        <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}