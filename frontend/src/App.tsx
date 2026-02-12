import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SuccessPage from './pages/SuccessPage';
import GizlilikPolitikasi from './pages/GizlilikPolitikasi';
import KullanimSartlari from './pages/KullanimSartlari';
import CerezPolitikasi from './pages/CerezPolitikasi';
import KVKK from './pages/KVKK';

type ViewType = 'landing' | 'dashboard' | 'success' | 'gizlilik-politikasi' | 'kullanim-sartlari' | 'cerez-politikasi' | 'kvkk';

function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Check URL for different pages
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/success') {
      setView('success');
    } else if (path === '/gizlilik-politikasi') {
      setView('gizlilik-politikasi');
    } else if (path === '/kullanim-sartlari') {
      setView('kullanim-sartlari');
    } else if (path === '/cerez-politikasi') {
      setView('cerez-politikasi');
    } else if (path === '/kvkk') {
      setView('kvkk');
    }
  }, []);

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

  const handleBackToLanding = () => {
    window.history.pushState({}, '', '/');
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-neon-purple border-b-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-text-primary font-medium text-lg animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Render based on view
  const renderView = () => {
    switch (view) {
      case 'success':
        return <SuccessPage />;
      case 'gizlilik-politikasi':
        return <GizlilikPolitikasi onBack={handleBackToLanding} />;
      case 'kullanim-sartlari':
        return <KullanimSartlari onBack={handleBackToLanding} />;
      case 'cerez-politikasi':
        return <CerezPolitikasi onBack={handleBackToLanding} />;
      case 'kvkk':
        return <KVKK onBack={handleBackToLanding} />;
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />;
      default:
        return (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onAuthSuccess={handleAuthSuccess}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
    </div>
  );
}

export default App;
