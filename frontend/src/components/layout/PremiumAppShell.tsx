import { ReactNode } from 'react';
import { Home, Video, Plus, Settings, LogOut, CreditCard, Users, Sparkles, Grid3x3, UserCheck, Wand2, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CreditDisplay from '../CreditDisplay';

interface PremiumAppShellProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  onBuyCredits?: () => void;
}

export default function PremiumAppShell({ 
  children, 
  currentView, 
  onNavigate, 
  onLogout, 
  isAdmin = false,
  onBuyCredits = () => {}
}: PremiumAppShellProps) {
  
  const userMenuItems = [
    { id: 'home', icon: Home, label: 'Ana Sayfa' },
    { id: 'videos', icon: Video, label: 'Videolarım' },
    { id: 'create', icon: Plus, label: 'Video Oluştur' },
    { id: 'subscription', icon: CreditCard, label: 'Paketler' },
    { id: 'settings', icon: Settings, label: 'Ayarlar' },
  ];

  const adminMenuItems = [
    { id: 'users', icon: Users, label: 'Kullanıcılar' },
    { id: 'styles', icon: Wand2, label: 'Video Stilleri' },
    { id: 'slider', icon: Grid3x3, label: 'Ana Sayfa Slider' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-lg font-bold">
              <span className="text-text-primary">Influencer</span>
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Seninle</span>
            </div>
          </div>
        </div>

        {/* User Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3">
            Menü
          </div>
          {userMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-text-primary shadow-glow-cyan'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                currentView === item.id ? 'text-neon-cyan' : ''
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3 pt-6">
                Yönetim
              </div>
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-text-primary shadow-glow-cyan'
                      : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    currentView === item.id ? 'text-neon-cyan' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-surface-elevated border-b border-border px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-text-primary">
              {userMenuItems.find(item => item.id === currentView)?.label || 
               adminMenuItems.find(item => item.id === currentView)?.label || 
               'Dashboard'}
            </h2>
          </div>
          
          {/* Credit Display */}
          <CreditDisplay onBuyCredits={onBuyCredits} />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
