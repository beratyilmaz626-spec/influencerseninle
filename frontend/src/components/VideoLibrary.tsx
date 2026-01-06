import { useState, useRef, useEffect } from 'react';
import { Play, Download, Share2, CreditCard as Edit, Trash2, Search, Filter } from 'lucide-react';
import { useVideos } from '../hooks/useVideos';
import VideoPlayer from './VideoPlayer';

export default function VideoLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing'>('all');
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const { videos, loading, error, deleteVideo, incrementViews, refetch } = useVideos();

  // Add refresh button handler
  const handleRefresh = () => {
    refetch();
  };

  // Polling: İşleniyor durumundaki videolar varsa otomatik yenile
  useEffect(() => {
    const hasProcessingVideos = videos.some(v => v.status === 'processing');
    
    if (hasProcessingVideos) {
      const pollInterval = setInterval(() => {
        console.log('🔄 Polling: İşleniyor durumundaki videolar için yenileme...');
        refetch();
      }, 5000); // 5 saniyede bir kontrol et
      
      return () => clearInterval(pollInterval);
    }
  }, [videos, refetch]);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="glass-card p-6 bg-surface/70">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Video Kütüphanesi</h1>
        <p className="text-text-secondary text-lg">Oluşturduğunuz videoları yönetin ve indirin</p>
      </div>

      {/* Premium Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted group-hover:text-neon-cyan transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Video ara..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all duration-300"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-5 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-glow-cyan disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-300"
          >
            {loading ? 'Yükleniyor...' : 'Yenile'}
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filterStatus === 'all'
                ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-glow-cyan'
                : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-neon-cyan'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filterStatus === 'completed'
                ? 'bg-gradient-to-r from-neon-green to-emerald-500 text-white shadow-lg'
                : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-neon-green'
            }`}
          >
            Tamamlandı
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filterStatus === 'processing'
                ? 'bg-gradient-to-r from-orange-400 to-neon-pink text-white shadow-lg'
                : 'bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-orange-400'
            }`}
          >
            İşleniyor
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card p-5 border-neon-pink/30 bg-neon-pink/10">
          <p className="text-neon-pink font-semibold">Hata: {error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-neon-pink to-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-glow-pink"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-neon-purple border-b-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-text-primary font-medium">Videolar yükleniyor...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-neon-cyan" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Video bulunamadı</h3>
          <p className="text-text-secondary">Arama veya filtre kriterlerinizi ayarlamayı deneyin</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onDelete={() => deleteVideo(video.id)}
              onPreview={(videoUrl, videoTitle) => {
                incrementViews(video.id);
                setSelectedVideo({ url: videoUrl, title: videoTitle });
              }}
            />
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        videoTitle={selectedVideo?.title || ''}
      />
    </div>
  );
}

function VideoCard({
  video,
  onDelete,
  onPreview,
}: {
  video: {
    id: string;
    name: string;
    status: string;
    created_at: string;
    duration: string;
    views: number;
    video_url: string | null;
    thumbnail_url: string | null;
  };
  onDelete: () => void;
  onPreview: (videoUrl: string, videoTitle: string) => void;
}) {
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
          console.log('✅ VideoLibrary autoplay başarılı:', video.name);
        } catch (error) {
          console.log('⚠️ VideoLibrary autoplay engellendi:', video.name, error);
        }
      };
      
      // Try multiple times
      setTimeout(playVideo, 100);
      setTimeout(playVideo, 500);
      setTimeout(playVideo, 1000);
      
      // Also try when video events fire
      videoElement.addEventListener('loadeddata', playVideo);
      videoElement.addEventListener('canplay', playVideo);
      
      return () => {
        videoElement.removeEventListener('loadeddata', playVideo);
        videoElement.removeEventListener('canplay', playVideo);
      };
    }
  }, [video.video_url, video.status, video.name]);

  // Create a video element to generate thumbnail
  const generateVideoThumbnail = (videoUrl: string) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.currentTime = 1; // Get frame at 1 second
    return new Promise<string>((resolve, reject) => {
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          resolve(canvas.toDataURL());
        } else {
          reject('Canvas context not available');
        }
      };
      video.onerror = reject;
      video.src = videoUrl;
    });
  };

  return (
    <div 
      className="glass-card overflow-hidden hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video bg-gradient-to-br from-surface to-surface-elevated flex items-center justify-center relative group overflow-hidden">
        {video.status === 'processing' ? (
          // İşleniyor durumu
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-neon-cyan font-semibold text-lg">İşleniyor...</span>
            <span className="text-text-secondary text-sm mt-1">Video hazırlanıyor</span>
          </div>
        ) : video.status === 'failed' ? (
          // Hata durumu
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neon-pink/10 to-red-500/10">
            <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <span className="text-neon-pink font-semibold text-lg">Hata Oluştu</span>
            <span className="text-text-secondary text-sm mt-1">Video oluşturulamadı</span>
          </div>
        ) : video.video_url && video.status === 'completed' ? (
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
                    console.log('VideoLibrary metadata sonrası oynatma başarısız:', video.name, error);
                  });
                }
              }}
              onCanPlay={(e) => {
                const videoElement = e.target as HTMLVideoElement;
                videoElement.currentTime = 1; // 1. saniyeden başla
                videoElement.play().catch((error) => {
                  console.log('VideoLibrary autoplay engellendi:', video.name, error);
                });
              }}
              onLoadedData={(e) => {
                const videoElement = e.target as HTMLVideoElement;
                videoElement.currentTime = 1;
                videoElement.play().catch((error) => {
                  console.log('VideoLibrary loadedData sonrası oynatma başarısız:', video.name, error);
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
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-neon-cyan font-medium">Önizleme yükleniyor...</p>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {thumbnailError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                <div className="text-center">
                  <Play className="w-12 h-12 text-text-secondary mb-2 mx-auto" />
                  <p className="text-sm text-text-secondary font-medium">Video Önizlemesi</p>
                </div>
              </div>
            )}
            
            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-text-secondary bg-gradient-to-br from-surface to-surface-elevated w-full h-full">
            <Play className="w-12 h-12 mb-2" />
            <p className="text-sm font-medium">Video Hazırlanıyor</p>
          </div>
        )}
        
        {/* Play button overlay */}
        {video.status === 'completed' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`bg-white/10 backdrop-blur-md text-neon-cyan px-4 py-2 rounded-full font-medium shadow-lg border border-neon-cyan/30 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 fill-current" />
                <span>İzle</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Click handler for completed videos */}
        {video.status === 'completed' && video.video_url && (
          <button
            onClick={() => onPreview(video.video_url!, video.name)}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`${video.name} videosunu izle`}
          >
          </button>
        )}
        
        {/* Duration badge */}
        {video.duration && video.duration !== '0:00' && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {video.duration}
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              video.status === 'completed'
                ? 'bg-neon-green/90 text-white border border-neon-green/50'
                : video.status === 'failed'
                ? 'bg-neon-pink/90 text-white border border-neon-pink/50'
                : 'bg-neon-cyan/90 text-white border border-neon-cyan/50'
            }`}
          >
            {video.status === 'completed' ? '✓ Hazır' : video.status === 'failed' ? '✗ Hata' : '⏳ İşleniyor'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-text-primary line-clamp-2 flex-1 pr-2">{video.name}</h3>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Play className="w-3 h-3" />
              <span>{video.views.toLocaleString()}</span>
            </span>
            {video.duration && video.duration !== '0:00' && (
              <span>{video.duration}</span>
            )}
          </div>
        </div>

        <div className="text-xs text-text-muted mb-4">
          {new Date(video.created_at).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {video.status === 'completed' && (
          <div className="flex gap-2">
            {video.video_url ? (
              <a
                href={video.video_url}
                download={`${video.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.mp4`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-glow-cyan text-white py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-1 hover:scale-[1.02]"
                onClick={(e) => {
                  // Direct download attempt
                  e.preventDefault();
                  const link = document.createElement('a');
                  link.href = video.video_url!;
                  link.download = `${video.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.mp4`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-4 h-4" />
                <span>İndir</span>
              </a>
            ) : (
              <button 
                disabled
                className="flex-1 bg-surface-elevated text-text-muted py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-1 cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>URL Yok</span>
              </button>
            )}
            <button 
              onClick={() => video.video_url && onPreview(video.video_url, video.name)}
              className="p-2 border border-border hover:bg-surface-elevated hover:border-neon-cyan rounded-xl transition-all"
              title="İzle"
            >
              <Play className="w-4 h-4 text-text-secondary" />
            </button>
            <button 
              onClick={() => {
                if (video.video_url) {
                  navigator.clipboard.writeText(video.video_url);
                  alert('Video linki kopyalandı!');
                }
              }}
              className="p-2 border border-border hover:bg-surface-elevated hover:border-neon-cyan rounded-xl transition-all"
              title="Linki Kopyala"
            >
              <Share2 className="w-4 h-4 text-text-secondary" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 border border-neon-pink/30 hover:bg-neon-pink/10 hover:border-neon-pink rounded-xl transition-all"
              title="Sil"
            >
              <Trash2 className="w-4 h-4 text-neon-pink" />
            </button>
          </div>
        )}
        
        {/* Processing durumunda disabled indirme butonu */}
        {video.status === 'processing' && (
          <div className="flex gap-2">
            <button 
              disabled
              className="flex-1 bg-surface-elevated text-text-muted py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-1 cursor-not-allowed"
            >
              <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
              <span>Hazırlanıyor...</span>
            </button>
            <button 
              onClick={onDelete}
              className="p-2 border border-neon-pink/30 hover:bg-neon-pink/10 hover:border-neon-pink rounded-xl transition-all"
              title="Sil"
            >
              <Trash2 className="w-4 h-4 text-neon-pink" />
            </button>
          </div>
        )}
        
        {/* Failed durumunda tekrar dene butonu */}
        {video.status === 'failed' && (
          <div className="flex gap-2">
            <button 
              className="flex-1 bg-gradient-to-r from-orange-400 to-neon-pink hover:shadow-lg text-white py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-1"
            >
              <span>Tekrar Dene</span>
            </button>
            <button 
              onClick={onDelete}
              className="p-2 border border-neon-pink/30 hover:bg-neon-pink/10 hover:border-neon-pink rounded-xl transition-all"
              title="Sil"
            >
              <Trash2 className="w-4 h-4 text-neon-pink" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}