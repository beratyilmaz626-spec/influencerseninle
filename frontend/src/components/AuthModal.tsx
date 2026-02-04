import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password, fullName);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('Email not confirmed')) {
        setError('E-posta adresinizi doğrulamanız gerekiyor.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'AI Destekli Video Oluşturma',
    'HD Kalite Dışa Aktarma',
    'Sınırsız Proje',
    'Premium Destek'
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0a0f1a] rounded-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/5 rounded-xl transition-colors"
        >
          <X className="w-6 h-6 text-gray-400 hover:text-white" />
        </button>
        
        <div className="grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="hidden md:flex relative bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 p-12 flex-col justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-white">
              {mode === 'signin' ? 'Tekrar Hoş Geldiniz!' : 'Bize Katılın'}
            </h2>
            
            <p className="text-lg text-gray-400 mb-8">
              {mode === 'signin' 
                ? 'Video kütüphanenize erişin' 
                : 'AI destekli video oluşturma platformu'
              }
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neon-green/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  </div>
                  <span className="text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 bg-[#0a0f1a]">
            {/* Mobile Header */}
            <div className="md:hidden text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'signin' ? 'Hoş Geldiniz!' : 'Kayıt Olun'}
              </h2>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex space-x-2 mb-6 p-1 bg-white/5 rounded-xl">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6 text-center">
              {mode === 'signin' 
                ? 'E-posta ve şifrenizle giriş yapın' 
                : 'Hesap oluşturmak için bilgilerinizi girin'}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      required
                      className="pl-12"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eposta@ornek.com"
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="premium"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>İşleniyor...</span>
                  </span>
                ) : (
                  mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'
                )}
              </Button>
            </form>

            {/* Footer Text */}
            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === 'signin' ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-neon-cyan hover:underline font-semibold"
              >
                {mode === 'signin' ? 'Kayıt olun' : 'Giriş yapın'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
