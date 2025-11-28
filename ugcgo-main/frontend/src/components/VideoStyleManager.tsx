import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

interface VideoStyle {
  id: string;
  style_id: string;
  name: string;
  image: string;
  prompt: string;
  order_index: number;
  is_active: boolean;
}

export default function VideoStyleManager() {
  const [styles, setStyles] = useState<VideoStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    style_id: '',
    name: '',
    image: '',
    prompt: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('video_styles')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      console.error('Error fetching styles:', error);
      alert('Stiller yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from('video_styles')
        .insert([formData]);

      if (error) throw error;

      alert('Stil başarıyla eklendi!');
      setShowAddForm(false);
      resetForm();
      fetchStyles();
    } catch (error: any) {
      console.error('Error adding style:', error);
      alert('Stil eklenirken hata: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const styleToUpdate = styles.find(s => s.id === id);
      if (!styleToUpdate) return;

      const { error } = await supabase
        .from('video_styles')
        .update({
          name: styleToUpdate.name,
          image: styleToUpdate.image,
          prompt: styleToUpdate.prompt,
          order_index: styleToUpdate.order_index,
          is_active: styleToUpdate.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('Stil başarıyla güncellendi!');
      setEditingId(null);
      fetchStyles();
    } catch (error: any) {
      console.error('Error updating style:', error);
      alert('Stil güncellenirken hata: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu stili silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('video_styles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Stil başarıyla silindi!');
      fetchStyles();
    } catch (error: any) {
      console.error('Error deleting style:', error);
      alert('Stil silinirken hata: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('video_styles')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchStyles();
    } catch (error: any) {
      console.error('Error toggling active:', error);
      alert('Durum değiştirilirken hata: ' + error.message);
    }
  };

  const handleInputChange = (id: string, field: keyof VideoStyle, value: any) => {
    setStyles(styles.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const resetForm = () => {
    setFormData({
      style_id: '',
      name: '',
      image: '',
      prompt: '',
      order_index: styles.length || 0,
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Video Stil Yönetimi</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Stil Ekle
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-semibold mb-4">Yeni Stil Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stil ID (Benzersiz, İngilizce)
              </label>
              <input
                type="text"
                value={formData.style_id}
                onChange={(e) => setFormData({ ...formData, style_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ornek: 'new-style'"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stil Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Türkçe isim"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video/GIF URL veya Yol
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/video.mp4 veya https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt (AI açıklaması)
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Bu stil için açıklama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıra
              </label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ekle
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Styles List */}
      <div className="space-y-4">
        {styles.map((style) => (
          <div
            key={style.id}
            className={`p-4 border-2 rounded-lg transition-colors ${
              style.is_active ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {style.image.endsWith('.mp4') || style.image.endsWith('.webm') ? (
                  <video
                    src={style.image}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                {editingId === style.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={style.name}
                      onChange={(e) => handleInputChange(style.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Stil adı"
                    />
                    <input
                      type="text"
                      value={style.image}
                      onChange={(e) => handleInputChange(style.id, 'image', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Video URL"
                    />
                    <textarea
                      value={style.prompt}
                      onChange={(e) => handleInputChange(style.id, 'prompt', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={2}
                      placeholder="Prompt"
                    />
                    <input
                      type="number"
                      value={style.order_index || 0}
                      onChange={(e) => handleInputChange(style.id, 'order_index', parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border rounded-lg"
                      placeholder="Sıra"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{style.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {style.style_id}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{style.prompt}</p>
                    <p className="text-xs text-gray-400 mt-1">Sıra: {style.order_index}</p>
                    <p className="text-xs text-blue-600 mt-1 break-all">{style.image}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {editingId === style.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(style.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Kaydet"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="İptal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(style.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleActive(style.id, style.is_active)}
                      className={`p-2 rounded-lg transition-colors ${
                        style.is_active
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={style.is_active ? 'Aktif' : 'Pasif'}
                    >
                      {style.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(style.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {styles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Henüz stil eklenmemiş. "Yeni Stil Ekle" butonuna tıklayarak başlayın.
        </div>
      )}
    </div>
  );
}
