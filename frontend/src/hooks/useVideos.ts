import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type Video = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];
type VideoUpdate = Database['public']['Tables']['videos']['Update'];

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        console.log('❌ No user logged in, skipping video fetch');
        setVideos([]);
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching videos for user:', user.id);

      // 🎯 BU SATIRDA FİLTRELEME YAPIYORUM:
      // .eq('user_id', user.id) ile sadece giriş yapan kullanıcının videolarını getiriyorum
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)  // 👈 BURADA FİLTRELEME!
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('=== VIDEO FİLTRELEME DETAYLARI ===');
      console.log('🔑 Giriş yapan kullanıcı ID:', user?.id);
      console.log('📊 Bu kullanıcının video sayısı:', data?.length || 0);
      console.log('📹 Bulunan videolar:', data);
      
      if (data && data.length > 0) {
        console.log('📝 Video detayları:');
        data.forEach((video, index) => {
          console.log(`  ${index + 1}. "${video.name}"`);
          console.log(`     - Video ID: ${video.id}`);
          console.log(`     - Sahibi: ${video.user_id}`);
          console.log(`     - Durum: ${video.status}`);
          console.log(`     - Tarih: ${video.created_at}`);
        });
      } else {
        console.log('❌ Bu kullanıcı için video bulunamadı!');
        console.log('💡 Kontrol edilecekler:');
        console.log('   - Kullanıcı ID doğru mu?');
        console.log('   - Videolar bu kullanıcı ID ile kaydedildi mi?');
      }
      console.log('================================');
      
      setVideos(data || []);
    } catch (err) {
      console.error('❌ Video getirme hatası:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (videoData: Omit<VideoInsert, 'user_id'>) => {
    if (!user) throw new Error('Kullanıcı girişi yapılmamış');

    // NOT: Kredi/abonelik kontrolü Dashboard.tsx'de useSubscriptionAccess ile yapılıyor.
    // Bu fonksiyon sadece video kaydı oluşturur.
    
    try {
      console.log('🎬 Yeni video oluşturuluyor, kullanıcı:', user.id);
      console.log('📝 Video data:', videoData);
      
      // 🎯 YENİ VİDEO OLUŞTURURKEN user_id EKLİYORUM:
      const { data, error } = await supabase
        .from('videos')
        .insert({
          ...videoData,
          user_id: user.id,  // 👈 BURADA KULLANICI ID'Sİ EKLENİYOR!
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }
      
      console.log('✅ Video başarıyla oluşturuldu:', data.id);
      
      // Yerel state'e ekle
      setVideos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('❌ createVideo error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Video oluşturulamadı';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateVideo = async (id: string, updates: VideoUpdate) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Yerel state'i güncelle
      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, ...data } : video
      ));
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video güncellenemedi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Yerel state'den kaldır
      setVideos(prev => prev.filter(video => video.id !== id));
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

      const { error } = await supabase
        .from('videos')
        .update({ views: video.views + 1 })
        .eq('id', id);

      if (error) throw error;

      // Yerel state'i güncelle
      setVideos(prev => prev.map(v => 
        v.id === id ? { ...v, views: v.views + 1 } : v
      ));
    } catch (err) {
      console.error('İzlenme sayısı artırılamadı:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [user?.id]); // Sadece kullanıcı ID değiştiğinde videoları yeniden getir

  return {
    videos,
    loading,
    error,
    createVideo,
    updateVideo,
    deleteVideo,
    incrementViews,
    refetch: fetchVideos,
  };
}