import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Play, X } from 'lucide-react';

interface SliderVideo {
  id: string;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export const VideoSlider = () => {
  const [videos, setVideos] = useState<SliderVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  // Use videos from public folder for Vercel compatibility
  const demoVideos: SliderVideo[] = [
    {
      id: 'demo-1',
      title: 'AI UGC Video 1',
      video_url: '/videos/ugc_video_1.mp4',
      thumbnail_url: null,
      order_index: 0,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      title: 'AI UGC Video 2',
      video_url: '/videos/ugc_video_2.mp4',
      thumbnail_url: null,
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideoIndex(null);
    };
    if (selectedVideoIndex !== null) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideoIndex]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slider_videos')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Use DB videos, demo videos, or nothing
  const displayItems = videos.length > 0 ? videos : demoVideos;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .scroll-container {
          overflow: hidden;
          width: 100%;
        }
        .infinite-scroll {
          animation: scroll 30s linear infinite;
        }
        .infinite-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .video-card {
          transition: transform 0.3s ease;
        }
        .video-card:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div className="w-full relative overflow-hidden py-8">
        <div className="scroll-container">
          <div className="infinite-scroll flex gap-6 w-max">
            {/* First set */}
            {displayItems.map((item, index) => (
              <div
                key={`first-${item.id}`}
                className="video-card flex-shrink-0 w-48 h-80 rounded-2xl overflow-hidden bg-gray-900 cursor-pointer relative group"
                onClick={() => item.video_url && setSelectedVideoIndex(index)}
              >
                {item.video_url ? (
                  <video
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    onError={(e) => console.log('Video error:', e)}
                  >
                    <source src={item.video_url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Duplicate for seamless scroll */}
            {displayItems.map((item, index) => (
              <div
                key={`second-${item.id}`}
                className="video-card flex-shrink-0 w-48 h-80 rounded-2xl overflow-hidden bg-gray-900 cursor-pointer relative group"
                onClick={() => item.video_url && setSelectedVideoIndex(index)}
              >
                {item.video_url ? (
                  <video
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    onError={(e) => console.log('Video error:', e)}
                  >
                    <source src={item.video_url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideoIndex !== null && displayItems[selectedVideoIndex]?.video_url && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          onClick={() => setSelectedVideoIndex(null)}
        >
          <div 
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={displayItems[selectedVideoIndex].video_url!}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              autoPlay
              loop
              playsInline
              controls
            />
            
            <button
              onClick={() => setSelectedVideoIndex(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
