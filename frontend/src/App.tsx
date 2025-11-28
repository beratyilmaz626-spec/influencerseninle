import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SuccessPage from './pages/SuccessPage';

function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'success'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Check URL for success page
  useState(() => {
    if (window.location.pathname === '/success') {
      setView('success');
    }
  });

  const handleGetStarted = () => {
    setView('dashboard');
  };

  const handleAuthSuccess = () => {
    setView('dashboard');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    signOut();
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-gray-700 font-medium text-lg animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {view === 'success' ? (
        <SuccessPage />
      ) : view === 'landing' ? (
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
