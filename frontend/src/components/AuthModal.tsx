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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2.5 hover:bg-red-50 rounded-xl transition-all duration-300 group hover:scale-110 hover:rotate-90"
        >
          <X className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors" />
        </button>
        
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Branding */}
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-12 flex flex-col justify-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 transform hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-5xl font-black mb-4 leading-tight">
                {mode === 'signin' ? 'Welcome Back!' : 'Join Us Today'}
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {mode === 'signin' 
                  ? 'Access your video library and continue creating amazing content' 
                  : 'Start your journey with AI-powered video creation platform'
                }
              </p>
              
              <div className="space-y-4 text-white/80">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold">AI-Powered Video Creation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold">HD Quality Export</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold">50+ AI Avatars</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-12 flex flex-col justify-center bg-gray-50">


            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-gray-600">
                {mode === 'signin' 
                  ? 'Enter your credentials to access your account' 
                  : 'Fill in your details to get started'
                }
              </p>
            </div>

        {/* Free Trial Benefits */}
        {mode === 'signup' && (
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-green-800 text-base">🎉 Ücretsiz Deneme Avantajları</span>
            </div>
            <ul className="space-y-2.5 text-sm text-green-700">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                <span><strong>3 adet ücretsiz video</strong> oluşturma hakkı</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                <span><strong>HD kalitede</strong> video indirme</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                <span><strong>50+ AI avatar</strong> seçeneği</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                <span><strong>Kredi kartı gerekmez</strong> - Hemen başla!</span>
              </li>
            </ul>
          </div>
        )}

        {mode === 'signin' && (
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-bold text-blue-800 text-base">🚀 Hoş Geldin!</span>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              Video kütüphanene erişim sağla ve <strong>AI ile profesyonel reklamlar</strong> oluşturmaya devam et!
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ad Soyad
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınızı ve soyadınızı girin"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 shadow-md animate-fade-in">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 disabled:from-blue-300 disabled:via-blue-400 disabled:to-cyan-300 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? 'Lütfen bekleyin...' : mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {mode === 'signin' ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all duration-200"
            >
              {mode === 'signin' ? 'Kayıt ol' : 'Giriş yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}