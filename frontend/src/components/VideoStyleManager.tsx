import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { EmptyState } from './ui/empty-state';

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
      setLoading(true);
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

  const resetForm = () => {
    setFormData({
      style_id: '',
      name: '',
      image: '',
      prompt: '',
      order_index: 0,
      is_active: true
    });
  };

  const updateStyle = (id: string, field: keyof VideoStyle, value: any) => {
    setStyles(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Video Stilleri</h1>
          <p className="text-text-secondary">Video stillerini görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchStyles}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="premium"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Yeni Stil Ekle</span>
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-neon-cyan/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Yeni Stil Ekle</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Stil ID</label>
                <Input
                  value={formData.style_id}
                  onChange={(e) => setFormData({ ...formData, style_id: e.target.value })}
                  placeholder="selfie, 360, vb."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">İsim</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Selfie"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-2">Görsel URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-2">Prompt</label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all duration-300"
                  placeholder="Stil açıklaması..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Sıra</label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                İptal
              </Button>
              <Button variant="premium" onClick={handleAdd}>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : styles.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={Plus}
          title="Henüz stil yok"
          description="Yeni bir video stili ekleyerek başlayın"
          action={
            <Button variant="premium" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Stili Ekle
            </Button>
          }
        />
      ) : (
        /* Premium Style List */
        <div className="space-y-4">
          {styles.map((style) => (
            <Card key={style.id} className="holographic-hover hover:shadow-glow-cyan transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-20 h-20 object-cover rounded-xl ring-2 ring-border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {editingId === style.id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <Input
                          value={style.name}
                          onChange={(e) => updateStyle(style.id, 'name', e.target.value)}
                          placeholder="Stil adı"
                        />
                        <Input
                          value={style.image}
                          onChange={(e) => updateStyle(style.id, 'image', e.target.value)}
                          placeholder="Görsel URL"
                        />
                        <textarea
                          value={style.prompt}
                          onChange={(e) => updateStyle(style.id, 'prompt', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all duration-300"
                        />
                        <div className="flex items-center space-x-3">
                          <Input
                            type="number"
                            value={style.order_index}
                            onChange={(e) => updateStyle(style.id, 'order_index', parseInt(e.target.value))}
                            className="w-24"
                          />
                          <Badge variant={style.is_active ? 'success' : 'error'}>
                            {style.is_active ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">{style.name}</h3>
                            <p className="text-sm text-text-secondary line-clamp-2">{style.prompt}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              #{style.order_index}
                            </Badge>
                            <Badge variant={style.is_active ? 'success' : 'error'}>
                              {style.is_active ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-text-muted font-mono">
                          ID: {style.style_id}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {editingId === style.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdate(style.id)}
                          className="text-neon-green hover:bg-neon-green/10"
                        >
                          <Save className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(null)}
                          className="text-text-muted hover:bg-surface-elevated"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(style.id)}
                          className="text-neon-cyan hover:bg-neon-cyan/10"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(style.id, style.is_active)}
                          className="text-text-secondary hover:bg-surface-elevated"
                        >
                          {style.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(style.id)}
                          className="text-neon-pink hover:bg-neon-pink/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && styles.length > 0 && (
        <Card className="bg-surface-elevated/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Toplam Stil</span>
              <div className="flex items-center space-x-4">
                <Badge variant="info">{styles.length}</Badge>
                <span className="text-text-muted">•</span>
                <span className="text-neon-green">{styles.filter(s => s.is_active).length} Aktif</span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted">{styles.filter(s => !s.is_active).length} Pasif</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
