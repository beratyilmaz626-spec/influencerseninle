import { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

      // Successful authentication
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message.includes('Email not confirmed')) {
        setError('E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-posta kutunuzu kontrol edin ve doğrulama linkine tıklayın.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-gray-200/50 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-xl transition-all duration-300 group hover:scale-110"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
        </button>


        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse-glow">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            {mode === 'signin' ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluştur'}
          </h2>
          <p className="text-gray-600 text-base">
            {mode === 'signin' 
              ? 'Video kütüphanenize erişmek için giriş yapın' 
              : 'Video oluşturmaya başlamak için ReklamDeha\'ya katılın'
            }
          </p>
        </div>

        {/* Free Trial Benefits */}
        {mode === 'signup' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-green-800">🎉 Ücretsiz Deneme Avantajları</span>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span><strong>3 adet ücretsiz video</strong> oluşturma hakkı</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span><strong>HD kalitede</strong> video indirme</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span><strong>50+ AI avatar</strong> seçeneği</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span><strong>Kredi kartı gerekmez</strong> - Hemen başla!</span>
              </li>
            </ul>
          </div>
        )}

        {mode === 'signin' && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-blue-800">🚀 Hoş Geldin!</span>
            </div>
            <p className="text-sm text-blue-700">
              Video kütüphanene erişim sağla ve <strong>AI ile profesyonel reklamlar</strong> oluşturmaya devam et!
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınızı ve soyadınızı girin"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Lütfen bekleyin...' : mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'signin' ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {mode === 'signin' ? 'Kayıt ol' : 'Giriş yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}