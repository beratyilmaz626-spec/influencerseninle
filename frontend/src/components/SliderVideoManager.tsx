import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Eye, EyeOff, GripVertical, Save, X, CreditCard as Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SliderVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SliderVideoManager() {
  const [videos, setVideos] = useState<SliderVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SliderVideo | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: 'UGC video',
    video_url: import.meta.env.VITE_DEMO_VIDEO_URL,
    thumbnail_url: ''
  });

  useEffect(() => {
    fetchSliderVideos();
  }, []);

  const fetchSliderVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slider_videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // If no videos exist, add the demo video automatically
      if (!data || data.length === 0) {
        const ugcVideo = {
          title: 'UGC video',
          video_url: import.meta.env.VITE_DEMO_VIDEO_URL,
          thumbnail_url: null,
          order_index: 0,
          is_active: true
        };
        
        const { data: insertedUgcVideo, error: insertError } = await supabase
          .from('slider_videos')
          .insert(ugcVideo)
          .select()
          .single();
          
        if (!insertError && insertedUgcVideo) {
          setVideos([insertedUgcVideo]);
        } else {
          setVideos([]);
        }
      } else {
        setVideos(data);
      }
    } catch (err) {
      console.error('Error fetching slider videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) return;

    try {
      const { data, error } = await supabase
        .from('slider_videos')
        .insert({
          title: newVideo.title,
          video_url: newVideo.video_url,
          thumbnail_url: newVideo.thumbnail_url || null,
          order_index: videos.length,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setVideos([...videos, data]);
      setNewVideo({ title: '', video_url: '', thumbnail_url: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding video:', err);
      alert('Video eklenirken hata oluştu');
    }
  };

  const updateVideo = async (id: string, updates: Partial<SliderVideo>) => {
    try {
      const { data, error } = await supabase
        .from('slider_videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVideos(videos.map(v => v.id === id ? data : v));
      setEditingVideo(null);
      alert('Video başarıyla güncellendi!');
    } catch (err) {
      console.error('Error updating video:', err);
      alert('Video güncellenirken hata oluştu');
    }
  };

  const handleEditSave = () => {
    if (!editingVideo) return;
    
    updateVideo(editingVideo.id, {
      title: editingVideo.title,
      video_url: editingVideo.video_url,
      thumbnail_url: editingVideo.thumbnail_url
    });
  };

  const deleteVideo = async (id: string) => {
    console.log('🗑️ deleteVideo çağrıldı, ID:', id);
    
    if (!confirm('Bu videoyu silmek istediğinizden emin misiniz?')) {
      console.log('❌ Kullanıcı silme işlemini iptal etti');
      return;
    }

    console.log('✅ Kullanıcı silmeyi onayladı, siliniyor...');
    
    try {
      const { error } = await supabase
        .from('slider_videos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        throw error;
      }
      
      console.log('✅ Video Supabase\'den silindi');
      
      // Remove from local state
      setVideos(videos.filter(v => v.id !== id));
      
      // Show success message
      alert('Video başarıyla silindi ve ana sayfadan kaldırıldı!');
      console.log('✅ Video local state\'den kaldırıldı');
    } catch (err) {
      console.error('❌ Error deleting video:', err);
      alert('Video silinirken hata oluştu: ' + (err as Error).message);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('slider_videos')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setVideos(videos.map(v => 
        v.id === id ? { ...v, is_active: !isActive } : v
      ));
    } catch (err) {
      console.error('Error toggling video status:', err);
    }
  };

  const updateOrder = async (id: string, newIndex: number) => {
    try {
      const { error } = await supabase
        .from('slider_videos')
        .update({ order_index: newIndex })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const updatedVideos = videos.map(v => 
        v.id === id ? { ...v, order_index: newIndex } : v
      );
      updatedVideos.sort((a, b) => a.order_index - b.order_index);
      setVideos(updatedVideos);
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Ana Sayfa Video Slider</h2>
          <p className="text-text-secondary">Ana sayfada görünecek videoları yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-4 py-2 rounded-xl font-medium transition-all inline-flex items-center space-x-2 shadow-glow-cyan">
            <Plus className="w-4 h-4" />
            <span>Video Ekle</span>
          </div>
        </button>
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Yeni Video Ekle</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Video Başlığı
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Video başlığını girin"
                className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={newVideo.video_url}
                onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Thumbnail URL (İsteğe Bağlı)
              </label>
              <input
                type="url"
                value={newVideo.thumbnail_url}
                onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
              />
              <p className="text-sm text-text-secondary mt-1">
                Ana sayfada görünecek ön izleme görseli URL'si
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border hover:bg-surface-elevated text-text-primary rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={addVideo}
                disabled={!newVideo.title || !newVideo.video_url}
                className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300 group-disabled:opacity-0"></div>
                <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-4 py-2 rounded-xl transition-all inline-flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Video Düzenle</h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Video Başlığı
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="Video başlığını girin"
                  className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={editingVideo.video_url}
                  onChange={(e) => setEditingVideo({ ...editingVideo, video_url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Thumbnail URL (İsteğe Bağlı)
                </label>
                <input
                  type="url"
                  value={editingVideo.thumbnail_url || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-text-primary placeholder-text-secondary focus:border-neon-cyan focus:shadow-glow-cyan focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 border border-border hover:bg-surface-elevated text-text-primary rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={!editingVideo.title || !editingVideo.video_url}
                  className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300 group-disabled:opacity-0"></div>
                  <div className="relative bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-4 py-2 rounded-xl transition-all inline-flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Güncelle</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Slider Videoları ({videos.length})
          </h3>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Videolar yükleniyor...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Henüz video yok</h4>
              <p className="text-gray-600 mb-4">İlk videonuzu eklemek için yukarıdaki butonu kullanın</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    video.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="cursor-move text-gray-400">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Video Preview */}
                  <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {video.thumbnail_url && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 hidden">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1">
                    <h4 className={`font-medium ${video.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {video.title}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 truncate">
                        Video: {video.video_url}
                      </p>
                      {video.thumbnail_url && (
                        <p className="text-xs text-green-600 truncate">
                          Thumbnail: {video.thumbnail_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order */}
                  <div className="text-sm text-gray-500">
                    #{index + 1}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingVideo(video)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleActive(video.id, video.is_active)}
                      className={`p-2 rounded-lg transition-colors ${
                        video.is_active
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={video.is_active ? 'Gizle' : 'Göster'}
                    >
                      {video.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        console.log('🖱️ Silme butonuna tıklandı');
                        deleteVideo(video.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}