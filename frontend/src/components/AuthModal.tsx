import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

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

  const features = [
    'AI Destekli Video Oluşturma',
    'HD Kalite Dışa Aktarma',
    'Sınırsız Proje',
    'Premium Destek'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 z-10 p-2 hover:bg-surface rounded-xl transition-all duration-300 group"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-text-secondary group-hover:text-neon-cyan transition-colors" />
          </button>
          
          <div className="glass-card overflow-hidden grid md:grid-cols-2 min-h-[600px]">
            {/* Left Side - Branding */}
            <div className="relative bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 p-12 flex flex-col justify-center overflow-hidden">
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
                  {mode === 'signin' ? 'Welcome Back!' : 'Join Us Today'}
                </h2>
                
                {/* Description */}
                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  {mode === 'signin' 
                    ? 'Access your video library and continue creating amazing content' 
                    : 'Start your journey with AI-powered video creation platform'
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
            <div className="p-12 bg-surface-elevated">
              <div className="h-full flex flex-col justify-center">
                {/* Mode Toggle */}
                <div className="flex space-x-2 mb-8 glass-card p-1">
                  <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      mode === 'signin'
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-glow-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      mode === 'signup'
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-glow-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <Input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="pl-12"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Password
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
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      mode === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </form>

                {/* Footer Text */}
                <p className="mt-6 text-center text-sm text-text-muted">
                  {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-neon-cyan hover:text-accent-hover font-semibold transition-colors"
                  >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
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
