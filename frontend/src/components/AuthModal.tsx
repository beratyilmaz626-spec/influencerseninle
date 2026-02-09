import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '../lib/supabase';

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
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  // Google OAuth ile giriş
  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError('Supabase bağlantısı kurulamadı');
      return;
    }
    
    setSocialLoading('google');
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (err) {
      console.error('Google giriş hatası:', err);
      setError(err instanceof Error ? err.message : 'Google ile giriş yapılamadı');
      setSocialLoading(null);
    }
  };

  // Apple OAuth ile giriş
  const handleAppleSignIn = async () => {
    if (!supabase) {
      setError('Supabase bağlantısı kurulamadı');
      return;
    }
    
    setSocialLoading('apple');
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (err) {
      console.error('Apple giriş hatası:', err);
      setError(err instanceof Error ? err.message : 'Apple ile giriş yapılamadı');
      setSocialLoading(null);
    }
  };

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
            <img 
              src="/images/logo.png" 
              alt="InfluencerSeninle Logo" 
              className="w-20 h-20 object-contain mb-8"
            />
            
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0a0f1a] text-gray-500">veya</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={socialLoading !== null}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'google' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {socialLoading === 'google' ? 'Yönlendiriliyor...' : 'Google ile devam et'}
                </button>

                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={socialLoading !== null}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'apple' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  {socialLoading === 'apple' ? 'Yönlendiriliyor...' : 'Apple ile devam et'}
                </button>
              </div>
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
