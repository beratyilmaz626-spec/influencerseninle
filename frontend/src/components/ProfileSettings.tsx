import { User, Mail, Building2, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export default function ProfileSettings() {
  const { userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    country: 'Türkiye',
  });

  // userProfile değiştiğinde formu güncelle
  useState(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        company_name: userProfile.company_name || '',
        country: userProfile.country || 'Türkiye',
      });
    }
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
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Ayarlar</h1>
        <p className="text-text-secondary">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <Card className={message.type === 'success' ? 'border-neon-green/30 bg-neon-green/10' : 'border-neon-pink/30 bg-neon-pink/10'}>
          <CardContent className="pt-6">
            <p className={message.type === 'success' ? 'text-neon-green' : 'text-neon-pink'}>{message.text}</p>
          </CardContent>
        </Card>
      )}

      {/* Premium Profile Card */}
      <Card className="holographic-hover">
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="pl-12"
                placeholder="Adınız Soyadınız"
              />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="email"
                value={formData.email}
                readOnly
                className="pl-12 opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="text-sm text-text-muted mt-2">E-posta adresi değiştirilemez</p>
          </div>

          {/* Şirket Adı */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Şirket Adı
              <Badge variant="outline" className="ml-2 text-xs">İsteğe Bağlı</Badge>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Şirket adınız"
                className="pl-12"
              />
            </div>
          </div>

          {/* Ülke */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Ülke
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <select 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all duration-300"
              >
                <option value="Türkiye">Türkiye</option>
                <option value="ABD">Amerika Birleşik Devletleri</option>
                <option value="İngiltere">İngiltere</option>
                <option value="Almanya">Almanya</option>
                <option value="Fransa">Fransa</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              variant="premium"
              className="w-full sm:w-auto"
            >
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Security Card */}
        <Card className="holographic-hover">
          <CardHeader>
            <CardTitle className="text-lg">Güvenlik</CardTitle>
            <CardDescription>Hesap güvenliği ayarları</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Şifre Değiştir
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="holographic-hover">
          <CardHeader>
            <CardTitle className="text-lg">Bildirimler</CardTitle>
            <CardDescription>E-posta bildirimleri</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Bildirim Ayarları
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
