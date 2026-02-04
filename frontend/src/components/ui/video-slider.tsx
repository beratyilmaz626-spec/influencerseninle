import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Play, ExternalLink } from 'lucide-react';

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

  // Demo videos - these will show if no database videos are available
  // Videos are served from backend static files
  const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
  const demoVideos = [
    {
      id: 'demo-1',
      title: 'AI UGC Video 1',
      video_url: `${backendUrl}/api/static/videos/ugc_video_1.mp4`,
      thumbnail_url: null,
      order_index: 0,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      title: 'AI UGC Video 2',
      video_url: `${backendUrl}/api/static/videos/ugc_video_2.mp4`,
      thumbnail_url: null,
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // Fallback images for when no videos are available
  const fallbackImages = [
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // Fetch active slider videos
      const { data, error } = await supabase
        .from('slider_videos')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos for slider:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Use videos if available from DB, otherwise use demo videos, then fallback to images
  const displayItems = videos.length > 0 ? videos : demoVideos.length > 0 ? demoVideos : fallbackImages.map((img, index) => ({
    id: `fallback-${index}`,
    title: `Demo Video ${index + 1}`,
    video_url: null,
    thumbnail_url: img,
    order_index: index,
    is_active: true,
    created_at: new Date().toISOString()
  }));

  // Only duplicate if we have fewer than 6 items for smooth animation
  const duplicatedItems = displayItems.length < 6 ? [...displayItems, ...displayItems] : displayItems;

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${displayItems.length < 6 ? '-50%' : `-${100 / displayItems.length}%`});
          }
        }

        .infinite-scroll {
          animation: scroll-right ${displayItems.length < 6 ? '20s' : `${displayItems.length * 3}s`} linear infinite;
        }

        .infinite-scroll:hover {
          animation-play-state: paused;
        }
        
        .animation-paused {
          animation-play-state: paused !important;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .video-overlay {
          background: linear-gradient(
            45deg,
            rgba(59, 130, 246, 0.9) 0%,
            rgba(147, 51, 234, 0.9) 100%
          );
        }
      `}</style>

      <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-transparent">
        <div className="relative z-10 w-full flex items-center justify-center py-8">
          <div className="scroll-container w-full">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedItems.map((item, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-48 lg:w-56 rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
                  style={{ aspectRatio: '9/16', height: '400px' }}
                >
                  <div className="relative w-full h-full group">
                    {/* Clickable overlay for videos - opens in new tab */}
                    {item.video_url && (
                      <a
                        href={item.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 w-full h-full z-20 cursor-pointer"
                        aria-label={`${item.title} videosunu izle`}
                      />
                    )}

                    {/* Show thumbnail image */}
                    <img
                      src={item.thumbnail_url || fallbackImages[index % fallbackImages.length]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Video overlay with play button and info */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4`}>
                      {/* Play button */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                      
                      {/* Video info */}
                      <div className="text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-xs">Tıkla ve izle</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="text-xs opacity-80">
                          AI ile üretilmiş UGC video
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};