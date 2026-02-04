import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Home, Video, Plus, Settings, LogOut, CreditCard, Play, BarChart3, Clock, Eye, TrendingUp, Users, Sparkles, Grid3x3 as Grid3X3, UserCheck, Wand2, Upload, X, ChevronDown, CheckCircle2, AlertTriangle, Menu, Gift, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVideos } from '../hooks/useVideos';
import VideoLibrary from './VideoLibrary';
import SubscriptionPanel from './SubscriptionPanel';
import ProfileSettings from './ProfileSettings';
import UserManagement from './UserManagement';
import SliderVideoManager from './SliderVideoManager';
import VideoStyleManager from './VideoStyleManager';
import GiftTokenManager from './GiftTokenManager';
import DatabaseMaintenance from './DatabaseMaintenance';
import { BackgroundGradient } from './ui/background-gradient';
import ImageUploadSection from './video-creation/ImageUploadSection';
import FormatSelectionSection from './video-creation/FormatSelectionSection';
import ContentCountSection from './video-creation/ContentCountSection';
import DialogSection from './video-creation/DialogSection';
import PromptSection from './video-creation/PromptSection';
import VoiceSelection from './video-creation/VoiceSelection';
import CreditDisplay from './CreditDisplay';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';
import { FEATURE_FLAGS } from '../config/feature-flags';

interface DashboardProps {
  onLogout: () => void;
}

type ViewType = 'home' | 'videos' | 'create' | 'subscription' | 'settings' | 'users' | 'slider' | 'styles' | 'gift' | 'database';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { videos, createVideo } = useVideos();
  const { isAdmin, userProfile, user } = useAuth();
  
  // Video styles from database
  const [styleOptions, setStyleOptions] = useState<any[]>([]);
  
  useEffect(() => {
    fetchVideoStyles();
  }, []);
  
  const fetchVideoStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('video_styles')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      // Transform to match expected format
      const transformed = data?.map(style => ({
        id: style.style_id,
        name: style.name,
        image: style.image,
        prompt: style.prompt
      })) || [];
      
      setStyleOptions(transformed);
    } catch (error) {
      console.error('Error fetching video styles:', error);
      // Fallback to default styles if database fetch fails
      setStyleOptions([
        {
          id: 'street-style',
          name: 'Outfit Check',
          image: '/fit-check.mp4',
          prompt: 'Sokakta yürüyen bir kadın, urban ortam, şehir hayatı, günlük kıyafetler, doğal hareket'
        },
        {
          id: 'sports',
          name: 'Selfie',
          image: '/selfie.mp4',
          prompt: 'Selfie çeken kişi, doğal ifadeler, rahat ortam, günlük yaşam, samimi anlar'
        }
      ]);
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'videos', label: 'Videolarım', icon: Video },
    { id: 'create', label: 'Video Üret', icon: Plus },
    { id: 'analytics', label: 'Analitik', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'subscription', label: 'Planlar', icon: CreditCard },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
    ...(isAdmin ? [
      { id: 'users', label: 'Kullanıcılar', icon: UserCheck },
      { id: 'gift', label: 'Hediye Token', icon: Gift },
      { id: 'slider', label: 'Ana Sayfa Slider', icon: Grid3X3 },
      { id: 'styles', label: 'Video Stilleri', icon: Wand2 },
      { id: 'database', label: 'Veritabanı', icon: Database },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Static Background - No animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#030712]/90 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">InfluencerSeninle</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/70"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* PremiumAppShell Wrapper - Sidebar ve Topbar burada */}
      <div className="flex relative">
        {/* PREMIUM SIDEBAR - Responsive with Glassmorphism */}
        <motion.aside 
          className={`
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:sticky
            z-50
            w-64 
            bg-[#0a0f1a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col
            h-[calc(100vh-56px)] lg:h-screen lg:min-h-screen
            transition-transform duration-300 ease-in-out
            top-14 lg:top-0
            overflow-y-auto
          `}
          initial={false}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-40" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-glow-cyan">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-lg font-bold">
                <span className="text-white">Influencer</span>
                <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Seninle</span>
              </div>
            </div>
            {/* Kullanıcı Bilgisi */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-neon-cyan/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-white font-bold text-sm">
                      {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0f1a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Kullanıcı'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {isAdmin ? '👑 Admin' : '👤 Kullanıcı'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Menü</div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/10 text-white border border-neon-cyan/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-neon-cyan' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {currentView === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                )}
              </button>
            ))}

            {isAdmin && (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 pt-6">Yönetim</div>
                {bottomItems.filter(i => ['users', 'gift', 'slider', 'styles', 'database'].includes(i.id)).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as ViewType);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-pink/10 text-white border border-neon-purple/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-neon-purple' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Items */}
          <div className="p-4 border-t border-white/5 space-y-1">
            {bottomItems.filter(i => ['subscription', 'settings'].includes(i.id)).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0 pt-14 lg:pt-0">
          {/* PREMIUM TOPBAR - Hidden on mobile (using mobile header instead) */}
          <header className="hidden lg:flex h-16 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 items-center justify-between sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-white">
                {sidebarItems.find(i => i.id === currentView)?.label || 
                 bottomItems.find(i => i.id === currentView)?.label || 
                 'Dashboard'}
              </h2>
              {/* Breadcrumb dots */}
              <div className="hidden md:flex items-center space-x-1.5">
                {['Ana Sayfa', currentView !== 'home' ? sidebarItems.find(i => i.id === currentView)?.label || bottomItems.find(i => i.id === currentView)?.label : null].filter(Boolean).map((item, index, arr) => (
                  <span key={index} className="flex items-center text-sm">
                    <span className="text-gray-500">{item}</span>
                    {index < arr.length - 1 && <span className="mx-2 text-gray-600">/</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditDisplay onBuyCredits={() => setCurrentView('subscription')} />
              {currentView === 'home' && (
                <motion.button
                  onClick={() => setCurrentView('create')}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 inline-flex items-center space-x-2 shadow-glow-cyan">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="hidden sm:inline">Video Oluştur</span>
                  </div>
                </motion.button>
              )}
            </div>
          </header>

          {/* PREMIUM MAIN CONTENT AREA */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[#030712]">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentView === 'home' && <HomeContent videos={videos} onCreateVideo={() => setCurrentView('create')} />}
              {currentView === 'videos' && <VideoLibrary />}
              {currentView === 'create' && <VideoCreateContent styleOptions={styleOptions} />}
              {currentView === 'subscription' && <SubscriptionPanel />}
              {currentView === 'settings' && <ProfileSettings />}
              {currentView === 'users' && <UserManagement />}
              {currentView === 'gift' && <GiftTokenManager />}
              {currentView === 'slider' && <SliderVideoManager />}
              {currentView === 'styles' && <VideoStyleManager />}
              {currentView === 'database' && <DatabaseMaintenance />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function HomeContent({ 
  videos, 
  onCreateVideo 
}: { 
  videos: any[]; 
  onCreateVideo: () => void; 
}) {
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const completedVideos = videos.filter(v => v.status === 'completed').length;
  const processingVideos = videos.filter(v => v.status === 'processing').length;

  const stats = [
    {
      title: 'Toplam Video',
      value: videos.length.toString(),
      icon: Video,
      gradient: 'from-neon-cyan to-neon-blue',
      glowColor: 'rgba(0,240,255,0.15)',
    },
    {
      title: 'Tamamlandı',
      value: completedVideos.toString(),
      icon: CheckCircle2,
      gradient: 'from-neon-green to-emerald-500',
      glowColor: 'rgba(0,255,136,0.15)',
    },
    {
      title: 'İşleniyor',
      value: processingVideos.toString(),
      icon: Clock,
      gradient: 'from-orange-400 to-neon-pink',
      glowColor: 'rgba(255,128,0,0.15)',
    },
    {
      title: 'Toplam Görüntülenme',
      value: totalViews.toString(),
      icon: Eye,
      gradient: 'from-neon-purple to-neon-pink',
      glowColor: 'rgba(168,85,247,0.15)',
    }
  ];

  const recentVideos = videos.slice(0, 4);

  return (
    <div className="space-y-8" data-testid="home-content">
      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <motion.div
              className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm overflow-hidden"
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)' }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{ boxShadow: `0 0 40px ${stat.glowColor}` }}
            >
              {/* Background glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <div>
                  <motion.p 
                    className="text-4xl font-black text-white mb-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Premium Hero CTA Card */}
      <motion.div 
        className="relative group overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Animated border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm" />
        
        <div className="relative p-8 md:p-10 bg-[#0a0f1a]/90 rounded-3xl overflow-hidden">
          {/* Background effects */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <motion.div 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-300">AI Destekli</span>
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                Etkileyici Videolar Oluşturun
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                AI teknolojisi ile fikirlerinizi saniyeler içinde profesyonel videolara dönüştürün
              </p>
            </div>
            <motion.button
              onClick={onCreateVideo}
              className="relative group/btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              data-testid="create-video-btn"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur opacity-50 group-hover/btn:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center space-x-3 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-500" />
                <span>Video Oluştur</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Premium Recent Videos Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Son Videolar</h3>
          <motion.button 
            onClick={() => {}}
            className="text-neon-cyan hover:text-white font-medium text-sm transition-colors flex items-center gap-1"
            whileHover={{ x: 5 }}
          >
            Tümünü Görüntüle 
            <span className="text-lg">→</span>
          </motion.button>
        </div>
        
        {recentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {recentVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-neon-cyan/30 transition-all duration-300">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="aspect-video relative">
                    <VideoThumbnail video={video} />
                  </div>
                  <div className="p-4 relative">
                    <h4 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-neon-cyan transition-colors">
                      {video.name}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{video.views} görüntüleme</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        video.status === 'completed' 
                          ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
                          : 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                      }`}>
                        {video.status === 'completed' ? 'Hazır' : 'İşleniyor'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Video className="w-12 h-12 text-neon-cyan" />
            </motion.div>
            <h4 className="text-xl font-semibold text-white mb-2">Henüz video yok</h4>
            <p className="text-gray-500 mb-6">İlk videonuzu oluşturmak için başlayın</p>
            <motion.button
              onClick={onCreateVideo}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-8 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              İlk Videonuzu Oluşturun
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function VideoThumbnail({ video }: { video: any }) {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force autoplay when component mounts
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && video.video_url && video.status === 'completed') {
      const playVideo = async () => {
        try {
          videoElement.currentTime = 1; // Start from 1 second
          await videoElement.play();
          console.log('✅ Video autoplay başarılı:', video.name);
        } catch (error) {
          console.log('⚠️ Video autoplay engellendi:', video.name, error);
        }
      };
      
      // Try to play immediately
      playVideo();
      
      // Also try when video is loaded
      videoElement.addEventListener('loadeddata', playVideo);
      videoElement.addEventListener('canplay', playVideo);
      
      return () => {
        videoElement.removeEventListener('loadeddata', playVideo);
        videoElement.removeEventListener('canplay', playVideo);
      };
    }
  }, [video.video_url, video.status, video.name]);

  return (
    <div 
      className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-3 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {video.video_url && video.status === 'completed' ? (
        <>
          <video 
            ref={videoRef}
            src={video.video_url}
            title={video.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              thumbnailLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={() => {
              setThumbnailLoaded(true);
              // Force play on metadata load
              const videoElement = videoRef.current;
              if (videoElement) {
                videoElement.currentTime = 1;
                videoElement.play().catch((error) => {
                  console.log('Metadata sonrası oynatma başarısız:', video.name, error);
                });
              }
            }}
            onCanPlay={(e) => {
              const videoElement = e.target as HTMLVideoElement;
              videoElement.currentTime = 1; // 1. saniyeden başla
              videoElement.play().catch((error) => {
                console.log('Dashboard video autoplay engellendi:', video.name, error);
              });
            }}
            onLoadedData={(e) => {
              const videoElement = e.target as HTMLVideoElement;
              videoElement.currentTime = 1;
              videoElement.play().catch((error) => {
                console.log('LoadedData sonrası oynatma başarısız:', video.name, error);
              });
            }}
            onTimeUpdate={(e) => {
              const videoElement = e.target as HTMLVideoElement;
              // Video sonuna geldiğinde başa sar
              if (videoElement.currentTime >= videoElement.duration - 0.5) {
                videoElement.currentTime = 1;
              }
            }}
            onError={() => setThumbnailError(true)}
          />
          
          {/* Loading state */}
          {!thumbnailLoaded && !thumbnailError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-xs text-blue-600 font-medium">Yükleniyor...</p>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {thumbnailError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <Play className="w-8 h-8 text-gray-400 mb-1 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Video</p>
              </div>
            </div>
          )}
          
          {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full">
          {video.status === 'processing' ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-medium text-blue-600">İşleniyor...</p>
            </>
          ) : (
            <>
              <Play className="w-8 h-8 mb-1" />
              <p className="text-xs font-medium">Video</p>
            </>
          )}
        </div>
      )}
      
      {/* Play button overlay */}
      {video.status === 'completed' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1.5 rounded-full font-medium shadow-lg transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="flex items-center space-x-1.5">
              <Play className="w-3 h-3 fill-current" />
              <span className="text-sm">İzle</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing overlay */}
      {video.status === 'processing' && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/95 to-orange-50/95 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs text-yellow-700 font-semibold">İşleniyor</p>
        </div>
      )}
      
      {/* Duration badge */}
      {video.duration && video.duration !== '0:00' && (
        <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs font-medium">
          {video.duration}
        </div>
      )}
      
      {/* Status badge */}
      <div className="absolute top-1.5 left-1.5">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
            video.status === 'completed'
              ? 'bg-green-500/90 text-white border border-green-400/50'
              : 'bg-yellow-500/90 text-white border border-yellow-400/50'
          }`}
        >
          {video.status === 'completed' ? '✓' : '⏳'}
        </span>
      </div>
    </div>
  );
}

function StyleCard({ 
  style, 
  isSelected, 
  onSelect,
  isPremium = false,
  hasPremiumAccess = true
}: { 
  style: { id: string; name: string; image: string; isPremium?: boolean }; 
  isSelected: boolean; 
  onSelect: () => void;
  isPremium?: boolean;
  hasPremiumAccess?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLockedTooltip, setShowLockedTooltip] = useState(false);
  const isVideo = style.image.endsWith('.mp4') || style.image.endsWith('.webm');
  const isLocked = isPremium && !hasPremiumAccess;
  
  // Optimize Unsplash image URLs with proper size parameters
  const optimizedImageUrl = style.image.includes('unsplash.com') 
    ? `${style.image}?w=400&h=700&fit=crop&q=80&auto=format`
    : style.image;
  
  const handleClick = () => {
    if (isLocked) {
      setShowLockedTooltip(true);
      setTimeout(() => setShowLockedTooltip(false), 2000);
      return;
    }
    onSelect();
  };

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={handleClick}
        className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-lg ${
          isSelected ? 'ring-4 ring-blue-500 shadow-xl' : 'hover:ring-2 hover:ring-white'
        } ${isLocked ? 'opacity-70' : ''}`}
        style={{ width: '100%' }}
      >
        {/* Loading skeleton */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {isVideo ? (
          <video
            src={style.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => setImageLoaded(true)}
            onError={() => setHasError(true)}
          />
        ) : (
          <img
            src={optimizedImageUrl}
            alt={style.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
        
        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <span className="text-white text-xs text-center px-2">Görsel yüklenemedi</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="text-white font-semibold text-sm">{style.name}</h4>
          {isPremium && (
            <span className="text-xs text-neon-purple">Premium</span>
          )}
        </div>
        {isSelected && !isLocked && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {/* Lock Icon for Premium Templates */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 bg-surface/80 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xs text-white/90 font-medium">Premium</span>
            </div>
          </div>
        )}
        {/* Locked Tooltip */}
        {showLockedTooltip && isLocked && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3">
            <div className="text-center">
              <p className="text-white text-xs font-medium mb-2">
                Bu şablon Profesyonel ve üstü paketlerde kullanılabilir
              </p>
              <span className="text-neon-cyan text-xs">Paketi Yükselt →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCreateContent({ styleOptions }: { styleOptions: any[] }) {
  const { createVideo } = useVideos(); // Video oluşturma fonksiyonu
  const { user } = useAuth(); // User bilgisi - webhook için gerekli
  const { 
    isAdmin,
    isSubscriptionActive, 
    canCreateVideo, 
    hasFeature,
    hasGiftCredits,
    remainingVideos, 
    videoLimit, 
    videosUsed,
    giftCredits,
    currentPlan,
    currentPlanId,
    maxVideoDuration,
    loading: subscriptionLoading,
    dismissLimitBanner,
    isLimitBannerDismissed,
    getSubscriptionStatusMessage,
    incrementVideoUsage,
    refetchGiftCredits
  } = useSubscriptionAccess();
  
  const [selectedFormat, setSelectedFormat] = useState('');
  const [contentCount, setContentCount] = useState(1);
  const [dialogType, setDialogType] = useState('auto');
  const [customDialog, setCustomDialog] = useState('');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Form states
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState('');
  const [styleType, setStyleType] = useState('auto'); // 'auto' or 'manual'
  const [promptType, setPromptType] = useState('auto'); // 'auto' or 'manual'
  const [manualPrompt, setManualPrompt] = useState('');
  
  // Voice Selection state (Feature Flag: VOICE_SELECTION)
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  
  // Modal state
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLimitBanner, setShowLimitBanner] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Abonelik durumu mesajı
  const subscriptionStatus = getSubscriptionStatusMessage();

  const formats = [
    { id: '16:9', name: 'Yatay' },
    { id: '9:16', name: 'Dikey' },
  ];

  const dialogOptions = [
    { id: 'auto', name: 'Otomatik Konuşma', desc: 'AI tarafından oluşturulan' },
    { id: 'custom', name: 'Özel Konuşma', desc: 'Kendi metninizi yazın' },
    { id: 'none', name: 'Konuşma Olmasın', desc: 'Video\'da konuşma olmaz' }
  ];

  const sectorOptions = [
    { id: 'ai', name: '🤖 AI', emoji: '🤖' },
    { id: 'fitness', name: '💪 Fitness', emoji: '💪' },
    { id: 'tech', name: '💻 Teknoloji', emoji: '💻' },
    { id: 'nutrition', name: '🍎 Beslenme', emoji: '🍎' },
    { id: 'marketing', name: '📈 Pazarlama', emoji: '📈' },
    { id: 'crypto', name: '₿ Kripto', emoji: '₿' },
    { id: 'relationships', name: '💕 İlişkiler', emoji: '💕' },
    { id: 'legal', name: '⚖️ Hukuk', emoji: '⚖️' },
    { id: 'finance', name: '💰 Finans', emoji: '💰' },
    { id: 'ecommerce', name: '🛒 E-ticaret', emoji: '🛒' },
    { id: 'travel', name: '✈️ Seyahat', emoji: '✈️' },
    { id: 'developer', name: '👨‍💻 Geliştirici', emoji: '👨‍💻' },
    { id: 'corporate', name: '🏢 Kurumsal', emoji: '🏢' },
    { id: 'career', name: '👔 Kariyer', emoji: '👔' },
    { id: 'business', name: '💼 İş', emoji: '💼' },
    { id: 'trading', name: '📊 Ticaret', emoji: '📊' },
    { id: 'gaming', name: '🎮 Oyun', emoji: '🎮' },
    { id: 'kids', name: '👶 Çocuk', emoji: '👶' },
    { id: 'astrology', name: '🔮 Astroloji', emoji: '🔮' },
    { id: 'language', name: '🗣️ Dil', emoji: '🗣️' },
    { id: 'books', name: '📚 Kitaplar', emoji: '📚' },
    { id: 'beauty', name: '💄 Güzellik', emoji: '💄' },
    { id: 'medical', name: '🏥 Medikal', emoji: '🏥' },
    { id: 'cosmetics', name: '💋 Kozmetik', emoji: '💋' },
    { id: 'design', name: '🎨 Tasarım', emoji: '🎨' },
    { id: 'realestate', name: '🏘️ Emlak', emoji: '🏘️' },
    { id: 'fashion', name: '👗 Moda', emoji: '👗' },
    { id: 'music', name: '🎵 Müzik', emoji: '🎵' },
    { id: 'food', name: '🍕 Yemek', emoji: '🍕' },
    { id: 'sports', name: '⚽ Spor', emoji: '⚽' },
  ];

  const handlePhotoUpload = (file: File) => {
    console.log('📷 handlePhotoUpload çağrıldı');
    console.log('📷 File:', file);
    console.log('📷 File name:', file.name);
    console.log('📷 File type:', file.type);
    console.log('📷 File size:', file.size);
    
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin');
      return;
    }
    setUploadedImage(file);
    console.log('✅ uploadedImage state güncellendi:', file.name);
  };

  const handleVideoGeneration = async () => {
    // ÖN KONTROLLER (Frontend güvenliği - Backend'de de yapılacak)
    
    // 1. Video oluşturma hakkı kontrolü (abonelik VEYA hediye kredisi)
    const videoCheck = canCreateVideo();
    if (!videoCheck.allowed) {
      alert(`❌ ${videoCheck.reason}`);
      return;
    }
    
    // 2. Fotoğraf kontrolü (ZORUNLU - kesinlikle)
    if (!uploadedImage) {
      alert('❌ Video oluşturmak için en az 1 fotoğraf yüklemelisin.');
      return;
    }
    
    setIsGenerating(true);
    
    // Hediye kredisi mi kullanılacak?
    const useGiftCredits = videoCheck.useGiftCredits || false;
    
    try {
      // Prepare form data
      const formData = new FormData();
      
      // ÖNEMLİ: Kullanıcı kimliği - n8n'nin Supabase'e kayıt atması için ZORUNLU
      if (user?.id) {
        formData.append('user_id', user.id);
      } else {
        alert('❌ Kullanıcı bilgisi bulunamadı. Lütfen yeniden giriş yapın.');
        setIsGenerating(false);
        return;
      }
      
      // ÖNEMLİ: Dil ve video süresi parametreleri
      formData.append('language', 'tr');  // Türkçe dil
      formData.append('videoDuration', maxVideoDuration.toString());  // 10 veya 15 saniye
      
      // Add all form fields
      formData.append('format', selectedFormat);
      formData.append('contentCount', contentCount.toString());
      formData.append('dialogType', dialogType);
      formData.append('customDialog', customDialog);
      formData.append('styleType', styleType);
      formData.append('stylePrompt', styleType === 'manual' ? prompt : '');
      formData.append('promptType', promptType);
      formData.append('manualPrompt', promptType === 'manual' ? manualPrompt : '');
      formData.append('gender', gender);
      formData.append('age', age);
      formData.append('location', location);
      formData.append('sector', sector);
      if (selectedStyle) {
        formData.append('selectedStyle', selectedStyle);
      }
      // Voice selection (if feature enabled)
      if (FEATURE_FLAGS.VOICE_SELECTION && selectedVoice) {
        formData.append('selectedVoice', selectedVoice);
      }
      
      // Add image if uploaded
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }
      
      // Add timestamp
      formData.append('timestamp', new Date().toISOString());
      
      // Check if webhook URL is configured
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        alert('🎬 N8N webhook URL yapılandırılmamış. Lütfen .env dosyasına VITE_N8N_WEBHOOK_URL ekleyin.');
        setIsGenerating(false);
        return;
      }
      
      // Video ismini hazırla
      const sectorName = sectorOptions.find(s => s.id === sector)?.name || sector;
      const videoName = `${sectorName} - ${new Date().toLocaleDateString('tr-TR')}`;
      const videoDescription = `${gender}, ${age}, ${location} - ${dialogType === 'custom' ? customDialog : 'Otomatik diyalog'}`;
      
      // Debug: FormData içeriğini logla
      console.log('📤 N8N webhook\'a gönderilen veriler:');
      console.log('  - user_id:', user?.id);
      console.log('  - language:', 'tr (Türkçe)');
      console.log('  - videoDuration:', maxVideoDuration, 'saniye');
      console.log('  - format:', selectedFormat);
      console.log('  - gender:', gender);
      console.log('  - sector:', sector);
      console.log('  - webhookUrl:', webhookUrl);
      
      // Send to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('📥 N8N Response:', result);
        
        // Parse response - support multiple formats
        // Format 1: { success, status, video: { id, url } }
        // Format 2: { success, videoId, videoUrl }
        // Format 3: { success, message: "Workflow was started" } - Processing state
        
        // "Workflow was started" means N8N accepted the request - this is SUCCESS
        const isWorkflowStarted = result.message?.toLowerCase().includes('workflow') || 
                                   result.message?.toLowerCase().includes('started') ||
                                   result.message?.toLowerCase().includes('processing');
        
        const videoStatus = result.status || (isWorkflowStarted ? 'processing' : (result.success ? 'completed' : 'failed'));
        const videoId = result.video?.id || result.videoId;
        const videoUrl = result.video?.url || result.videoUrl || result.url;
        
        // N8N isteği kabul ettiyse (success: true veya workflow started)
        if (result.success || isWorkflowStarted) {
          try {
            // Video kaydını oluştur
            const videoData = {
              name: videoName,
              description: videoDescription,
              video_url: videoUrl || '', // URL yoksa boş string (processing durumunda)
              thumbnail_url: videoUrl ? videoUrl.replace('.mp4', '_thumb.jpg') : '',
              status: (videoUrl ? 'completed' : 'processing') as 'completed' | 'processing' | 'failed', // URL varsa completed, yoksa processing
              views: 0,
            };
            
            await createVideo(videoData);
            console.log('✅ Video veritabanına kaydedildi:', videoData);
            
            // Kullanımı güncelle (hediye kredisi veya abonelik)
            await incrementVideoUsage(useGiftCredits);
            
            // Hediye kredisi kullanıldıysa yeniden yükle
            if (useGiftCredits) {
              await refetchGiftCredits();
            }
            
            if (!videoUrl) {
              // Video henüz hazır değil - processing durumu
              alert('🎬 Video işleme başladı!\n\nVideo hazır olduğunda "Videolarım" bölümünde görünecek.\n\nNot: Video işleme birkaç dakika sürebilir.');
            } else {
              // Video hazır
              alert('🎬 Video başarıyla oluşturuldu!\n\n"Videolarım" bölümünde görüntüleyebilirsiniz.');
            }
            
            // Formu temizle
            setUploadedImage(null);
            setGender('');
            setAge('');
            setLocation('');
            setSector('');
            setSelectedFormat('');
            setContentCount(1);
            setDialogType('auto');
            setCustomDialog('');
            setStyleType('auto');
            setPrompt('');
            setPromptType('auto');
            setManualPrompt('');
            setSelectedStyle(null);
            
          } catch (saveError) {
            console.error('❌ Video kaydetme hatası:', saveError);
            alert(`Video işleme başladı ancak veritabanına kaydedilemedi.\n\nHata: ${saveError}`);
          }
        } else {
          // Failed status
          const errorMessage = result.message || result.error || 'Bilinmeyen hata';
          console.error('❌ Video oluşturma başarısız:', errorMessage);
          alert(`Video oluşturma başarısız!\n\nHata: ${errorMessage}`);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Webhook error:', error);
      alert(`Video oluşturma isteği gönderilirken bir hata oluştu.\n\nHata: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Stil seçildiğinde prompt'u otomatik doldur
  const handleStyleSelection = (styleId: string) => {
    // Eğer otomatik stil seçiliyse uyarı göster
    if (styleType === 'auto') {
      setShowWarningModal(true);
      return;
    }
    
    setSelectedStyle(styleId);
    
    // Seçilen stilin prompt'unu bul ve prompt alanına ekle
    const selectedStyleData = styleOptions.find(style => style.id === styleId);
    if (selectedStyleData && selectedStyleData.prompt) {
      setPrompt(selectedStyleData.prompt);
    }
  };

  const handleSectorSelect = (sectorId: string) => {
    setSector(sectorId);
    setShowSectorModal(false);
  };

  // Form validation reason for UI feedback
  const getFormValidationError = (): string | null => {
    // 1. Video oluşturma hakkı kontrolü (abonelik VEYA hediye kredisi)
    const videoCheck = canCreateVideo();
    if (!videoCheck.allowed) {
      return videoCheck.reason || 'Bu dönemlik video hakkın bitti. Dönem yenilenince devam edebilirsin.';
    }
    
    // 2. Fotoğraf kontrolü (ZORUNLU - kesinlikle)
    if (!uploadedImage) {
      return 'Video oluşturmak için en az 1 fotoğraf yüklemelisin.';
    }
    
    // 3. Diğer alan kontrolleri
    if (!gender) return 'Lütfen cinsiyet seç.';
    if (!age) return 'Lütfen yaş aralığı seç.';
    if (!location) return 'Lütfen mekan seç.';
    if (!sector) return 'Lütfen sektör seç.';
    if (!selectedFormat) return 'Lütfen video formatı seç.';
    
    // Stil kontrolü
    if (styleType === 'manual' && !prompt.trim()) {
      return 'Manuel stil seçtin, lütfen stil açıklaması yaz.';
    }
    
    // Prompt kontrolü
    if (promptType === 'manual' && !manualPrompt.trim()) {
      return 'Manuel prompt seçtin, lütfen prompt yaz.';
    }
    
    return null;
  };
  
  const isFormValid = () => {
    return getFormValidationError() === null;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-transparent rounded-2xl overflow-hidden gap-6" data-testid="video-create-content">
      {/* Premium Left Panel - Controls */}
      <div className="w-full lg:w-80 bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4 overflow-y-auto flex-shrink-0">
        {/* Premium Header */}
        <motion.div 
          className="text-center pb-4 border-b border-white/5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-white mb-1">🎬 Video Oluştur</h2>
          <p className="text-gray-500 text-xs">✨ AI ile profesyonel video reklamları</p>
        </motion.div>
            {/* Premium Photo Upload */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-white">📸 Fotoğraf Yükle</h3>
              <div className="border-2 border-dashed border-neon-cyan/20 rounded-xl p-3 text-center hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300 bg-white/[0.02]">
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <motion.div 
                      className="space-y-1"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <img 
                        src={URL.createObjectURL(uploadedImage)} 
                        alt="Uploaded photo"
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <p className="text-neon-green text-xs font-medium truncate">{uploadedImage.name}</p>
                      <p className="text-gray-500 text-xs">Değiştir</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <Upload className="w-6 h-6 text-gray-500 mx-auto" />
                      <div>
                        <p className="text-white font-medium text-xs">Fotoğraf yükle</p>
                        <p className="text-gray-500 text-xs">PNG, JPG</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </motion.div>

            {/* Content Count */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-sm font-semibold text-white">🎯 Kaç Adet UGC İçerik Üretilsin</h3>
              <div className="flex items-center justify-center space-x-2">
                <motion.button
                  onClick={() => setContentCount(Math.max(1, contentCount - 1))}
                  className="w-8 h-8 bg-white/5 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/30 rounded-lg flex items-center justify-center transition-all duration-300"
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-bold text-white">-</span>
                </motion.button>
                <div className="text-center px-4">
                  <div className="text-xl font-bold text-neon-cyan">{contentCount}</div>
                  <div className="text-gray-500 text-xs">Video</div>
                </div>
                <motion.button
                  onClick={() => setContentCount(Math.min(10, contentCount + 1))}
                  className="w-8 h-8 bg-white/5 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/30 rounded-lg flex items-center justify-center transition-all duration-300"
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-bold text-white">+</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Cinsiyet */}
            <motion.div 
              className="space-y-2 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-white">👤 Cinsiyet</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'gender' ? null : 'gender')}
                className={`w-full p-3 rounded-xl border bg-white/[0.02] text-white transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/30 ${openDropdown === 'gender' ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}
              >
                <span className="text-sm font-medium">{gender || 'Cinsiyet Seçin'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openDropdown === 'gender' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'gender' && (
                <motion.div 
                  className="absolute z-50 w-full bg-[#0a0f1a] border border-white/10 rounded-xl shadow-elevated mt-2 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {['Kadın', 'Erkek'].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGender(g);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-sm text-left transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-white/5 ${
                        gender === g ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Yaş */}
            <motion.div 
              className="space-y-2 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-sm font-semibold text-white">🎂 Yaş</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'age' ? null : 'age')}
                className={`w-full p-3 rounded-xl border bg-white/[0.02] text-white transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/30 ${openDropdown === 'age' ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}
              >
                <span className="text-sm font-medium">{age ? `${age} yaş` : 'Yaş Seçin'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openDropdown === 'age' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'age' && (
                <motion.div 
                  className="absolute z-50 w-full bg-[#0a0f1a] border border-white/10 rounded-xl shadow-elevated mt-2 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {['18-25', '25-35', '35-50'].map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAge(a);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-sm text-left transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-white/5 ${
                        age === a ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-white'
                      }`}
                    >
                      {a} yaş
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Mekan */}
            <motion.div 
              className="space-y-2 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-white">🏠 Mekan</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                className={`w-full p-3 rounded-xl border bg-white/[0.02] text-white transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/30 ${openDropdown === 'location' ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}
              >
                <span className="text-sm font-medium">{location || 'Mekan Seçin'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'location' && (
                <motion.div 
                  className="absolute z-50 w-full bg-[#0a0f1a] border border-white/10 rounded-xl shadow-elevated mt-2 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {['İç Mekan', 'Dış Mekan'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocation(l);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-sm text-left transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-white/5 ${
                        location === l ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Sektör */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="text-sm font-semibold text-white">💼 Sektör</h3>
              <button
                onClick={() => setShowSectorModal(true)}
                className={`w-full p-3 rounded-xl border transition-all duration-300 text-left ${
                  sector
                    ? 'border-neon-cyan/50 bg-neon-cyan/5 text-neon-cyan'
                    : 'border-white/10 hover:border-neon-cyan/30 bg-white/[0.02] text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {sector ? sectorOptions.find(s => s.id === sector)?.name : 'Sektör Seçin'}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </motion.div>

            {/* Format Selection */}
            <motion.div 
              className="space-y-2 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-white">📐 Format</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'format' ? null : 'format')}
                className={`w-full p-3 rounded-xl border bg-white/[0.02] text-white transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/30 ${openDropdown === 'format' ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}
              >
                <span className="text-sm font-medium">
                  {selectedFormat ? formats.find(f => f.id === selectedFormat)?.name : 'Video Formatını Seçin'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openDropdown === 'format' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'format' && (
                <motion.div 
                  className="absolute z-50 w-full bg-[#0a0f1a] border border-white/10 rounded-xl shadow-elevated mt-2 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormat(format.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-4 text-left transition-all duration-200 border-b border-white/5 last:border-0 flex items-center space-x-2 hover:bg-white/5 ${
                        selectedFormat === format.id ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-white'
                      }`}
                    >
                      <div className="font-medium text-sm">{format.name}</div>
                      {format.id === '16:9' ? (
                        <div className="w-8 h-5 border-2 border-current rounded"></div>
                      ) : (
                        <div className="w-5 h-8 border-2 border-current rounded"></div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Dialog Type */}
            <motion.div 
              className="space-y-2 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className="text-sm font-semibold text-white">💬 Konuşma Metni</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'dialog' ? null : 'dialog')}
                className={`w-full p-3 rounded-xl border bg-white/[0.02] text-white transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/30 ${openDropdown === 'dialog' ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}
              >
                <span className="text-sm font-medium">
                  {dialogOptions.find(d => d.id === dialogType)?.name || 'Seçin'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openDropdown === 'dialog' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'dialog' && (
                <motion.div 
                  className="absolute z-50 w-full bg-[#0a0f1a] border border-white/10 rounded-xl shadow-elevated mt-2 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {dialogOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setDialogType(option.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-left transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-white/5 ${
                        dialogType === option.id ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-white'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                    </button>
                  ))}
                </motion.div>
              )}
              
              {dialogType === 'custom' && (
                <motion.div 
                  className="mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <textarea
                    value={customDialog}
                    onChange={(e) => setCustomDialog(e.target.value)}
                    placeholder="Özel diyalog metnini yazın..."
                    className="w-full h-16 bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:outline-none resize-none transition-all duration-300"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Voice Selection - Feature Flag Controlled */}
            {FEATURE_FLAGS.VOICE_SELECTION && (
              <div className="space-y-2">
                <VoiceSelection
                  selectedVoice={selectedVoice}
                  onSelectVoice={setSelectedVoice}
                  disabled={isGenerating}
                />
              </div>
            )}

            {/* Video Stilini Seçin */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-text-primary">🎨 Video Stilini Seçin</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'styleType' ? null : 'styleType')}
                className={`w-full p-3 rounded-xl border border-border bg-surface text-text-primary transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/50 ${openDropdown === 'styleType' ? 'border-neon-cyan shadow-glow-cyan' : ''}`}
              >
                <span className="text-sm font-medium">
                  {styleType === 'auto' ? 'Otomatik Stil' : 'Stilini Seç'}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${openDropdown === 'styleType' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'styleType' && (
                <div className="absolute z-50 w-full bg-surface border border-border rounded-xl shadow-elevated mt-2 overflow-hidden">
                  <button
                    onClick={() => {
                      setStyleType('auto');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-sm text-left transition-all duration-200 border-b border-border hover:bg-surface-elevated ${
                      styleType === 'auto' ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-text-primary'
                    }`}
                  >
                    Otomatik Stil
                  </button>
                  <button
                    onClick={() => {
                      setStyleType('manual');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-sm text-left transition-all duration-200 hover:bg-surface-elevated ${
                      styleType === 'manual' ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-text-primary'
                    }`}
                  >
                    Stilini Seç
                  </button>
                </div>
              )}
              {styleType === 'manual' && (
                <div className="mt-2">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Video stilini açıklayın..."
                    className="w-full h-16 bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none resize-none transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Prompt */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-text-primary">✍️ Prompt</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'promptType' ? null : 'promptType')}
                className={`w-full p-3 rounded-xl border border-border bg-surface text-text-primary transition-all duration-300 text-left flex items-center justify-between hover:border-neon-cyan/50 ${openDropdown === 'promptType' ? 'border-neon-cyan shadow-glow-cyan' : ''}`}
              >
                <span className="text-sm font-medium">
                  {promptType === 'auto' ? 'Otomatik Prompt' : 'Manuel Prompt'}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${openDropdown === 'promptType' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'promptType' && (
                <div className="absolute z-50 w-full bg-surface border border-border rounded-xl shadow-elevated mt-2 overflow-hidden">
                  <button
                    onClick={() => {
                      setPromptType('auto');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-sm text-left transition-all duration-200 border-b border-border hover:bg-surface-elevated ${
                      promptType === 'auto' ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-text-primary'
                    }`}
                  >
                    Otomatik Prompt
                  </button>
                  <button
                    onClick={() => {
                      setPromptType('manual');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-sm text-left transition-all duration-200 hover:bg-surface-elevated ${
                      promptType === 'manual' ? 'bg-neon-cyan/10 text-neon-cyan font-semibold' : 'text-text-primary'
                    }`}
                  >
                    Manuel Prompt
                  </button>
                </div>
              )}
              {promptType === 'manual' && (
                <div className="mt-2">
                  <textarea
                    value={manualPrompt}
                    onChange={(e) => setManualPrompt(e.target.value)}
                    placeholder="Prompt metnini yazın..."
                    className="w-full h-16 bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none resize-none transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Kalan Video Hakkı UI */}
            <div className="space-y-2 pt-4 border-t border-border">
              {!subscriptionLoading && (
                <div className="glass-card p-3 bg-surface-elevated/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-secondary">Aylık Video Hakkı</span>
                    {currentPlan && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                        {currentPlan.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-text-primary">
                      {remainingVideos} <span className="text-sm font-normal text-text-secondary">/ {videoLimit}</span>
                    </span>
                    <span className="text-xs text-text-muted">Kullanılan: {videosUsed}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        remainingVideos <= 3 ? 'bg-orange-400' : 
                        remainingVideos <= 0 ? 'bg-neon-pink' : 'bg-gradient-to-r from-neon-cyan to-neon-purple'
                      }`}
                      style={{ width: `${videoLimit > 0 ? ((videoLimit - remainingVideos) / videoLimit) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Abonelik/Limit Uyarı Banner'ı */}
              {subscriptionStatus && showLimitBanner && !isLimitBannerDismissed() && (
                <div className={`p-3 rounded-xl border ${
                  subscriptionStatus.type === 'error' ? 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink' :
                  subscriptionStatus.type === 'warning' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' :
                  'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{subscriptionStatus.message}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowLimitBanner(false);
                        dismissLimitBanner();
                      }}
                      className="text-text-secondary hover:text-text-primary ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {(subscriptionStatus.type === 'error' || subscriptionStatus.type === 'warning') && (
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="mt-2 w-full text-xs py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                    >
                      Paketi Yükselt →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Video Oluştur Button */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-text-primary">🚀 Video Oluşturmaya Hazır mısınız?</h3>
              
              {/* Form validation hatası gösterimi */}
              {!isFormValid() && !isGenerating && (
                <p className="text-xs text-orange-400 bg-orange-400/10 p-2 rounded-lg border border-orange-400/20">
                  ⚠️ {getFormValidationError()}
                </p>
              )}
              
              <button
                onClick={() => {
                  // DETAYLI DEBUG LOG
                  console.log('========================================');
                  console.log('🔘 VIDEO OLUŞTUR BUTONUNA TIKLANDI!');
                  console.log('========================================');
                  console.log('📸 uploadedImage:', uploadedImage);
                  console.log('📸 uploadedImage type:', typeof uploadedImage);
                  console.log('📸 uploadedImage name:', uploadedImage?.name);
                  console.log('👤 isAdmin:', isAdmin);
                  console.log('🔄 isGenerating:', isGenerating);
                  console.log('📋 Form values:', { gender, age, location, sector, selectedFormat });
                  
                  // canCreateVideo kontrolü
                  const videoCheck = canCreateVideo();
                  console.log('✅ canCreateVideo:', videoCheck);
                  
                  // Hakkı yoksa plan seçim modalını aç
                  if (!videoCheck.allowed) {
                    console.log('❌ Video oluşturma izni yok, modal açılıyor');
                    setShowSubscriptionModal(true);
                    return;
                  }
                  
                  // Fotoğraf kontrolü
                  console.log('📸 Fotoğraf kontrolü: uploadedImage =', uploadedImage ? 'VAR' : 'YOK');
                  if (!uploadedImage) {
                    console.log('❌ Fotoğraf yok, alert gösteriliyor');
                    alert('⚠️ Video oluşturmak için en az 1 fotoğraf yüklemelisin.');
                    return;
                  }
                  
                  // Diğer validasyonlar
                  const error = getFormValidationError();
                  console.log('📋 Form validation error:', error);
                  if (error) {
                    console.log('❌ Form hatası:', error);
                    alert(`⚠️ ${error}`);
                    return;
                  }
                  
                  // Video oluştur
                  console.log('✅ Tüm kontroller geçti, video oluşturuluyor...');
                  handleVideoGeneration();
                }}
                disabled={isGenerating}
                type="button"
                style={{ position: 'relative', zIndex: 100 }}
                className={`w-full ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'} transition-transform`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50 pointer-events-none" style={{ zIndex: -1 }}></div>
                <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-glow-cyan">
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg">✨ Oluşturuluyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span className="text-lg">🎬 Video Oluştur</span>
                    </>
                  )}
                </div>
              </button>
            </div>
      </div>

      {/* Premium Right Panel - Style Selection - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block flex-1 bg-[#0a0f1a]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6">
        <div className="h-full">
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Video Stili Seçin</h3>
            <p className="text-sm text-gray-500">Videonuz için uygun bir stil kategorisi seçin</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {styleOptions.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyle === style.id}
                onSelect={() => handleStyleSelection(style.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Style Selection - Shown only on mobile/tablet (below lg) */}
      <motion.div 
        className="lg:hidden mt-4 bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-3">
          <h3 className="text-base font-semibold text-white mb-1">Video Stili Seçin</h3>
          <p className="text-xs text-gray-500">Videonuz için uygun bir stil seçin (kaydırarak tümünü görebilirsin)</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[350px] overflow-y-auto pb-2 pr-1">
          {styleOptions.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              isSelected={selectedStyle === style.id}
              onSelect={() => handleStyleSelection(style.id)}
            />
          ))}
        </div>
        {selectedStyle && (
          <motion.div 
            className="mt-3 p-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xs text-neon-cyan text-center font-medium">
              ✓ Seçilen: {styleOptions.find(s => s.id === selectedStyle)?.name || 'Stil'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Sektör Modal */}
      {showSectorModal && createPortal(
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSectorModal(false);
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Sektör Seçin</h3>
                <motion.button
                  onClick={() => setShowSectorModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sectorOptions.map((sectorOption) => (
                  <motion.button
                    key={sectorOption.id}
                    onClick={() => handleSectorSelect(sectorOption.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      sector === sectorOption.id
                        ? 'border-neon-cyan/50 bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                        : 'border-white/10 hover:border-neon-cyan/30 bg-white/[0.02]'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{sectorOption.emoji}</div>
                      <div className={`text-sm font-medium ${
                        sector === sectorOption.id ? 'text-neon-cyan' : 'text-white'
                      }`}>
                        {sectorOption.name.replace(sectorOption.emoji + ' ', '')}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Warning Modal */}
      {showWarningModal && createPortal(
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 10000 }}
          onClick={() => setShowWarningModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="p-8 text-center">
              <motion.div 
                className="mb-6 text-7xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                🎨✨
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Hoop! Bir dakika! 🙌
              </h3>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                Manuel video stili seçmek için önce <span className="font-semibold text-neon-cyan">"Stilini Seç"</span> seçeneğine geçmelisin! 😊
              </p>
              <motion.button
                onClick={() => setShowWarningModal(false)}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  Anladım! 👍
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Subscription Required Modal - Hakkı olmayan kullanıcılar için */}
      {showSubscriptionModal && createPortal(
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 10001 }}
          onClick={() => setShowSubscriptionModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Video Oluşturmak İçin Plan Gerekli
              </h3>
              <p className="text-gray-400 mb-6">
                Video oluşturabilmek için bir abonelik planı seçmeniz veya hediye krediniz olması gerekiyor.
              </p>
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    setShowSubscriptionModal(false);
                    setShowUpgradeModal(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📋 Planları İncele
                </motion.button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full py-2 text-gray-500 hover:text-white transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Upgrade/Select Plan Modal - Kullanıcı durumuna göre dinamik içerik */}
      {showUpgradeModal && createPortal(
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 10001 }}
          onClick={() => setShowUpgradeModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isSubscriptionActive() ? '🚀 Planını Yükselt' : '📋 Plan Seç'}
                  </h3>
                  {/* Mevcut Plan gösterimi */}
                  {currentPlan && isSubscriptionActive() && (
                    <p className="text-xs text-gray-500 mt-1">
                      Mevcut Plan: <span className="text-neon-cyan font-semibold">{currentPlan.name}</span>
                    </p>
                  )}
                </div>
                <motion.button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">
                {isSubscriptionActive() 
                  ? 'Daha fazla video oluşturmak ve premium özelliklere erişmek için planınızı yükseltin.'
                  : 'Video oluşturmaya başlamak için bir plan seçin.'}
              </p>
              
              {/* USD Bilgilendirme */}
              <div className="p-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
                <p className="text-xs text-gray-400">
                  💱 Ödeme USD ($) olarak alınır. Bankanız TL karşılığını yansıtabilir.
                </p>
              </div>
              
              {/* Plan Cards - Dinamik filtreleme */}
              <div className="grid gap-3">
                {/* Başlangıç - Sadece abonelik yoksa veya inactive ise göster */}
                {(!isSubscriptionActive() || currentPlanId === null) && (
                  <motion.div 
                    className="p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 hover:bg-neon-green/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Başlangıç</span>
                      <span className="text-neon-green font-bold">$10/ay</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">20 video/ay • HD 1080p • Filigransız • E-posta desteği</p>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-green to-emerald-500 text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all">
                      Başlangıç'a Geç
                    </button>
                  </motion.div>
                )}
                
                {/* Profesyonel - Starter veya abonelik yoksa göster */}
                {(!isSubscriptionActive() || currentPlanId === 'starter') && (
                  <motion.div 
                    className="p-4 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">Profesyonel</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan">Popüler</span>
                      </div>
                      <span className="text-neon-cyan font-bold">$20/ay</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">45 video/ay • Premium şablonlar • Öncelikli destek • API erişimi</p>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                      Profesyonel'e Geç
                    </button>
                  </motion.div>
                )}
                
                {/* Professional plan - disabled gösterim */}
                {isSubscriptionActive() && currentPlanId === 'professional' && (
                  <div className="p-4 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 opacity-70">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">Profesyonel</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/30 text-neon-cyan">Mevcut Plan</span>
                      </div>
                      <span className="text-neon-cyan font-bold">$20/ay</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">45 video/ay • Premium şablonlar • Öncelikli destek • API erişimi</p>
                    <button disabled className="w-full py-2 rounded-lg bg-white/5 text-gray-500 text-sm font-semibold cursor-not-allowed">
                      ✓ Mevcut Planın
                    </button>
                  </div>
                )}
                
                {/* Kurumsal - Starter, Professional veya abonelik yoksa göster */}
                {(!isSubscriptionActive() || currentPlanId === 'starter' || currentPlanId === 'professional') && (
                  <motion.div 
                    className="p-4 rounded-xl border border-neon-purple/20 bg-neon-purple/5 hover:bg-neon-purple/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Kurumsal</span>
                      <span className="text-neon-purple font-bold">$40/ay</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">100 video/ay • Tüm özellikler • Özel destek • Beyaz etiket</p>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                      Kurumsal'a Geç
                    </button>
                  </motion.div>
                )}
                
                {/* Enterprise plan - disabled gösterim veya en yüksek plan mesajı */}
                {isSubscriptionActive() && currentPlanId === 'enterprise' && (
                  <div className="p-6 rounded-xl border border-neon-purple/30 bg-neon-purple/10 text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <h4 className="text-lg font-bold text-white mb-2">Zaten en yüksek plandasın!</h4>
                    <p className="text-sm text-gray-400">
                      Kurumsal plan ile tüm özelliklere ve en yüksek video limitine sahipsin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}