import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Google ile giriş
  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading('google');
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google sign in error:', err);
      if (err instanceof Error) {
        setError('Google ile giriş yapabilmek için Supabase Dashboard\'dan Google provider\'ı etkinleştirmeniz gerekiyor.');
      } else {
        setError('Google ile giriş yapılırken bir hata oluştu');
      }
      setSocialLoading(null);
    }
  };

  // Apple ile giriş
  const handleAppleSignIn = async () => {
    try {
      setSocialLoading('apple');
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Apple sign in error:', err);
      if (err instanceof Error) {
        setError('Apple ile giriş yapabilmek için Supabase Dashboard\'dan Apple provider\'ı etkinleştirmeniz gerekiyor.');
      } else {
        setError('Apple ile giriş yapılırken bir hata oluştu');
      }
      setSocialLoading(null);
    }
  };

  const features = [
    'AI Destekli Video Oluşturma',
    'HD Kalite Dışa Aktarma',
    'Sınırsız Proje',
    'Premium Destek'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl my-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-10 sm:-top-12 right-0 z-10 p-2 hover:bg-surface rounded-xl transition-all duration-300 group"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-text-secondary group-hover:text-neon-cyan transition-colors" />
          </button>
          
          <div className="glass-card overflow-hidden grid md:grid-cols-2 min-h-[auto] md:min-h-[600px]">
            {/* Left Side - Branding - Hidden on mobile */}
            <div className="hidden md:flex relative bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 p-8 lg:p-12 flex-col justify-center overflow-hidden">
              {/* Animated Background Orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mb-8 shadow-glow-cyan">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h2 className="text-4xl font-bold mb-4 text-text-primary">
                  {mode === 'signin' ? 'Tekrar Hoş Geldiniz!' : 'Bize Katılın'}
                </h2>
                
                {/* Description */}
                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  {mode === 'signin' 
                    ? 'Video kütüphanenize erişin ve muhteşem içerikler oluşturmaya devam edin' 
                    : 'AI destekli video oluşturma platformu ile yolculuğunuza başlayın'
                  }
                </p>
                
                {/* Features List */}
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-neon-green/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-neon-green" />
                      </div>
                      <span className="text-text-secondary font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 sm:p-8 lg:p-12 bg-surface-elevated">
              <div className="h-full flex flex-col justify-center">
                {/* Mobile Header */}
                <div className="md:hidden text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {mode === 'signin' ? 'Hoş Geldiniz!' : 'Kayıt Olun'}
                  </h2>
                </div>
                
                {/* Mode Toggle */}
                <div className="flex space-x-2 mb-6 glass-card p-1">
                  <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      mode === 'signin'
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-glow-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      mode === 'signup'
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-glow-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Kayıt Ol
                  </button>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                  {/* Google Button */}
                  <motion.button
                    onClick={handleGoogleSignIn}
                    disabled={socialLoading !== null || loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {socialLoading === 'google' ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <span>Google ile devam et</span>
                  </motion.button>

                  {/* Apple Button */}
                  <motion.button
                    onClick={handleAppleSignIn}
                    disabled={socialLoading !== null || loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-black hover:bg-gray-900 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {socialLoading === 'apple' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    )}
                    <span>Apple ile devam et</span>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-surface-elevated text-text-muted">veya e-posta ile</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Ad Soyad
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
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
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      E-posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
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
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
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
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="premium"
                    size="lg"
                    disabled={loading || socialLoading !== null}
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
                <p className="mt-6 text-center text-sm text-text-muted">
                  {mode === 'signin' ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
                  <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-neon-cyan hover:text-accent-hover font-semibold transition-colors"
                  >
                    {mode === 'signin' ? 'Kayıt olun' : 'Giriş yapın'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
