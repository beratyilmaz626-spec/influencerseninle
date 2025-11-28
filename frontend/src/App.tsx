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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
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
