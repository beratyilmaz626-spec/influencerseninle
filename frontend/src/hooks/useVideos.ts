import { useState, useEffect, useCallback } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type Video = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];
type VideoUpdate = Database['public']['Tables']['videos']['Update'];

// Global cache
let _videosCache: { userId: string; videos: Video[] } | null = null;

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const fetchVideos = useCallback(async () => {
    if (!userId) {
      setVideos([]);
      setLoading(false);
      return;
    }

    // Use cache if available
    if (_videosCache?.userId === userId) {
      setVideos(_videosCache.videos);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const videoList = data || [];
      _videosCache = { userId, videos: videoList };
      setVideos(videoList);
    } catch (err) {
      console.error('Video fetch error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch videos once when user changes
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const createVideo = async (video: Omit<VideoInsert, 'user_id'>) => {
    if (!userId) throw new Error('Kullanıcı girişi gerekli');

    try {
      const { data, error: createError } = await supabase
        .from('videos')
        .insert({ ...video, user_id: userId })
        .select()
        .single();

      if (createError) throw createError;

      // Update cache and state
      const newVideos = [data, ...videos];
      _videosCache = { userId, videos: newVideos };
      setVideos(newVideos);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video oluşturulamadı';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateVideo = async (id: string, updates: VideoUpdate) => {
    try {
      const { data, error: updateError } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const newVideos = videos.map(v => v.id === id ? { ...v, ...data } : v);
      if (userId) _videosCache = { userId, videos: newVideos };
      setVideos(newVideos);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video güncellenemedi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('videos').delete().eq('id', id);
      if (deleteError) throw deleteError;

      const newVideos = videos.filter(v => v.id !== id);
      if (userId) _videosCache = { userId, videos: newVideos };
      setVideos(newVideos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video silinemedi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const video = videos.find(v => v.id === id);
      if (!video) return;

      await supabase.from('videos').update({ views: (video.views || 0) + 1 }).eq('id', id);

      const newVideos = videos.map(v => v.id === id ? { ...v, views: (v.views || 0) + 1 } : v);
      if (userId) _videosCache = { userId, videos: newVideos };
      setVideos(newVideos);
    } catch (err) {
      console.error('Views increment failed:', err);
    }
  };

  const refetch = useCallback(() => {
    _videosCache = null;
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    createVideo,
    updateVideo,
    deleteVideo,
    incrementViews,
    refetch,
  };
}
