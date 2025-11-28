import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Home, Video, Plus, Settings, LogOut, CreditCard, Play, BarChart3, Clock, Eye, TrendingUp, Users, Sparkles, Grid3x3 as Grid3X3, UserCheck, Wand2, Upload, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVideos } from '../hooks/useVideos';
import VideoLibrary from './VideoLibrary';
import SubscriptionPanel from './SubscriptionPanel';
import ProfileSettings from './ProfileSettings';
import UserManagement from './UserManagement';
import SliderVideoManager from './SliderVideoManager';
import VideoStyleManager from './VideoStyleManager';
import { BackgroundGradient } from './ui/background-gradient';
import ImageUploadSection from './video-creation/ImageUploadSection';
import FormatSelectionSection from './video-creation/FormatSelectionSection';
import ContentCountSection from './video-creation/ContentCountSection';
import DialogSection from './video-creation/DialogSection';
import PromptSection from './video-creation/PromptSection';
import CreditDisplay from './CreditDisplay';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onLogout: () => void;
}

type ViewType = 'home' | 'videos' | 'create' | 'create2' | 'subscription' | 'settings' | 'users' | 'slider' | 'styles';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { videos } = useVideos();
  const { isAdmin } = useAuth();
  
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
      { id: 'slider', label: 'Ana Sayfa Slider', icon: Grid3X3 },
      { id: 'styles', label: 'Video Stilleri', icon: Wand2 },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Top Header with Logo and Navigation */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Top bar with logo and credits */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200/50">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                <Play className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">InfluencerSeninle</h1>
                <p className="text-xs text-gray-600 group-hover:text-blue-500 transition-colors duration-200">AI Video Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Credit Display */}
              <CreditDisplay onBuyCredits={() => setCurrentView('subscription')} />

              {/* Quick Action Button */}
              {currentView === 'home' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Yeni Video</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-110"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="py-4">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {/* Main Navigation Items */}
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300 mx-2"></div>

              {/* Bottom Items */}
              {bottomItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div>
          {currentView === 'home' && <HomeContent videos={videos} onCreateVideo={() => setCurrentView('create')} />}
          {currentView === 'videos' && <VideoLibrary />}
          {currentView === 'create' && <VideoCreateContent styleOptions={styleOptions} />}
          {currentView === 'create2' && <VideoCreate2Content />}
          {currentView === 'subscription' && <SubscriptionPanel />}
          {currentView === 'settings' && <ProfileSettings />}
          {currentView === 'users' && <UserManagement />}
          {currentView === 'slider' && <SliderVideoManager />}
          {currentView === 'styles' && <VideoStyleManager />}
        </div>
      </main>
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
      change: '+12%',
      icon: Video,
      color: 'bg-blue-50 text-blue-600',
      trend: 'up'
    },
    {
      title: 'İşleniyor',
      value: processingVideos.toString(),
      change: '-5%',
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      trend: 'down'
    }
  ];

  const recentVideos = videos.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Yeni Video Oluştur</h3>
            <p className="text-blue-50 text-lg">AI ile profesyonel video reklamları oluşturun</p>
          </div>
          <button
            onClick={onCreateVideo}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span>Hemen Başla</span>
          </button>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Son Videolar</h3>
            <button 
              onClick={() => {}}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Tümünü Görüntüle
            </button>
          </div>
        </div>
        <div className="p-6">
          {recentVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentVideos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <VideoThumbnail video={video} />
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{video.name}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.views} görüntüleme</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      video.status === 'completed' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {video.status === 'completed' ? 'Hazır' : 'İşleniyor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Henüz video yok</h4>
              <p className="text-gray-600 mb-6">İlk videonuzu oluşturmak için başlayın</p>
              <button
                onClick={onCreateVideo}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                İlk Videonuzu Oluşturun
              </button>
            </div>
          )}
        </div>
      </div>
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
            alt={video.name}
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
  onSelect 
}: { 
  style: { id: string; name: string; image: string }; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  const isVideo = style.image.endsWith('.mp4') || style.image.endsWith('.webm');
  
  return (
    <div className="flex items-center justify-center">
      <div
        onClick={onSelect}
        className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-lg ${
          isSelected ? 'ring-4 ring-blue-500 shadow-xl' : 'hover:ring-2 hover:ring-white'
        }`}
        style={{ width: '100%' }}
      >
        {isVideo ? (
          <video
            src={style.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={style.image}
            alt={style.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="text-white font-semibold text-sm">{style.name}</h4>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCreateContent({ styleOptions }: { styleOptions: any[] }) {
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
  
  // Modal state
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    { id: 'fashion', name: '👗 Giyim', emoji: '👗' },
    { id: 'beauty', name: '💄 Güzellik', emoji: '💄' }
  ];

  const handlePhotoUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin');
      return;
    }
    setUploadedImage(file);
  };

  const handleVideoGeneration = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare form data
      const formData = new FormData();
      
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
      
      // Add image if uploaded
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }
      
      // Add timestamp
      formData.append('timestamp', new Date().toISOString());
      
      // Add webhook callback URL for n8n to send results back
      const callbackUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-webhook`;
      formData.append('callbackUrl', callbackUrl);
      
      // Send to n8n webhook
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Webhook response:', result);
        alert('Video oluşturma isteği başarıyla gönderildi! Video hazır olduğunda "Videolarım" bölümünde görünecek.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      alert('Video oluşturma isteği gönderilirken bir hata oluştu.');
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

  const isFormValid = () => {
    const baseValid = uploadedImage && gender && age && location && sector && selectedFormat;
    
    // Stil kontrolü
    if (styleType === 'manual' && !prompt.trim()) {
      return false;
    }
    
    // Prompt kontrolü
    if (promptType === 'manual' && !manualPrompt.trim()) {
      return false;
    }
    
    return baseValid;
  };

  return (
    <div className="flex h-full bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="text-center pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">🎬 Video Oluştur</h2>
          <p className="text-gray-600 text-xs">✨ AI ile profesyonel video reklamları</p>
        </div>
            {/* Photo Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">📸 Fotoğraf Yükle</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <div className="space-y-1">
                      <img 
                        src={URL.createObjectURL(uploadedImage)} 
                        alt="Uploaded photo"
                        className="w-full h-16 object-cover rounded-md"
                      />
                      <p className="text-green-600 text-xs font-medium truncate">{uploadedImage.name}</p>
                      <p className="text-gray-500 text-xs">Değiştir</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-700 font-medium text-xs">Fotoğraf yükle</p>
                        <p className="text-gray-500 text-xs">PNG, JPG (maks. 10MB)</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Content Count */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">🎯 Kaç Adet UGC İçerik Üretilsin</h3>
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setContentCount(Math.max(1, contentCount - 1))}
                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                >
                  <span className="text-sm font-bold text-gray-700">-</span>
                </button>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{contentCount}</div>
                  <div className="text-gray-600 text-xs">Video</div>
                </div>
                <button
                  onClick={() => setContentCount(Math.min(10, contentCount + 1))}
                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"
                >
                  <span className="text-sm font-bold text-gray-700">+</span>
                </button>
              </div>
            </div>

            {/* Cinsiyet */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">👤 Cinsiyet</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'gender' ? null : 'gender')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">{gender || 'Cinsiyet Seçin'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'gender' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'gender' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  {['Kadın', 'Erkek'].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGender(g);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        gender === g ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Yaş */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">🎂 Yaş</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'age' ? null : 'age')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">{age ? `${age} yaş` : 'Yaş Seçin'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'age' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'age' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  {['18-25', '25-35', '35-50'].map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAge(a);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        age === a ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {a} yaş
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mekan */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">🏠 Mekan</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">{location || 'Mekan Seçin'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'location' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  {['İç Mekan', 'Dış Mekan'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocation(l);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        location === l ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sektör */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">💼 Sektör</h3>
              <button
                onClick={() => setShowSectorModal(true)}
                className={`w-full p-3 rounded-md border-2 transition-all text-left ${
                  sector
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {sector ? sectorOptions.find(s => s.id === sector)?.name : 'Sektör Seçin'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Format Selection */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">📐 Format</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'format' ? null : 'format')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">
                  {selectedFormat ? formats.find(f => f.id === selectedFormat)?.name : 'Video Formatını Seçin'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'format' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'format' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormat(format.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 flex items-center space-x-2 ${
                        selectedFormat === format.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">{format.name}</div>
                      {format.id === '16:9' ? (
                        <div className="w-8 h-5 border-2 border-gray-700 rounded"></div>
                      ) : (
                        <div className="w-5 h-8 border-2 border-gray-700 rounded"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dialog Type */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">💬 Konuşma Metni</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'dialog' ? null : 'dialog')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">
                  {dialogOptions.find(d => d.id === dialogType)?.name || 'Seçin'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'dialog' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'dialog' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  {dialogOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setDialogType(option.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                        dialogType === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-xs">{option.name}</div>
                      <div className="text-xs opacity-75">{option.desc}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {dialogType === 'custom' && (
                <div className="mt-2">
                  <textarea
                    value={customDialog}
                    onChange={(e) => setCustomDialog(e.target.value)}
                    placeholder="Özel diyalog metnini yazın..."
                    className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Video Stilini Seçin */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">🎨 Video Stilini Seçin</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'styleType' ? null : 'styleType')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">
                  {styleType === 'auto' ? 'Otomatik Stil' : 'Stilini Seç'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'styleType' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'styleType' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  <button
                    onClick={() => {
                      setStyleType('auto');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      styleType === 'auto' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Otomatik Stil
                  </button>
                  <button
                    onClick={() => {
                      setStyleType('manual');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors ${
                      styleType === 'manual' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
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
                    className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Prompt */}
            <div className="space-y-2 relative">
              <h3 className="text-sm font-semibold text-gray-900">✍️ Prompt</h3>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'promptType' ? null : 'promptType')}
                className="w-full p-3 rounded-md border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 transition-all text-left flex items-center justify-between"
              >
                <span className="text-xs font-medium">
                  {promptType === 'auto' ? 'Otomatik Prompt' : 'Manuel Prompt'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'promptType' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'promptType' && (
                <div className="absolute z-10 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg mt-1">
                  <button
                    onClick={() => {
                      setPromptType('auto');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      promptType === 'auto' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Otomatik Prompt
                  </button>
                  <button
                    onClick={() => {
                      setPromptType('manual');
                      setOpenDropdown(null);
                    }}
                    className={`w-full p-3 text-xs text-left hover:bg-gray-50 transition-colors ${
                      promptType === 'manual' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
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
                    className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Video Oluştur Button */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">🚀 Video Oluşturmaya Hazır mısınız?</h3>
              <button
                onClick={handleVideoGeneration}
                disabled={isGenerating || !isFormValid()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1 text-xs"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>✨ Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>🎬 Video Oluştur</span>
                  </>
                )}
              </button>
            </div>
      </div>

      {/* Center Area - Video Style Selection */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="h-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Stili Seçin</h3>
            <p className="text-sm text-gray-600">Videonuz için uygun bir stil kategorisi seçin</p>
          </div>
          
          <div className="grid grid-cols-5 max-h-[calc(100vh-200px)] overflow-y-auto" style={{ gap: '0.8cm' }}>
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

      {/* Sektör Modal */}
      {showSectorModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" 
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSectorModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Sektör Seçin</h3>
                <button
                  onClick={() => setShowSectorModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sectorOptions.map((sectorOption) => (
                  <button
                    key={sectorOption.id}
                    onClick={() => handleSectorSelect(sectorOption.id)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      sector === sectorOption.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{sectorOption.emoji}</div>
                      <div className={`text-sm font-medium ${
                        sector === sectorOption.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {sectorOption.name.replace(sectorOption.emoji + ' ', '')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Warning Modal */}
      {showWarningModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" 
          style={{ zIndex: 10000 }}
          onClick={() => setShowWarningModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform transition-all animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="mb-6 text-7xl animate-wiggle">
                🎨✨
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hoop! Bir dakika! 🙌
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Manuel video stili seçmek için önce <span className="font-semibold text-blue-600">"Stilini Seç"</span> seçeneğine geçmelisin! 😊
              </p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Anladım! 👍
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}