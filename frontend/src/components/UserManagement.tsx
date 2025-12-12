import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Building2, Globe, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { EmptyState } from './ui/empty-state';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      alert('Kullanıcı silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Kullanıcı Yönetimi</h1>
          <p className="text-text-secondary">Kayıtlı kullanıcıları görüntüleyin ve yönetin</p>
        </div>
        <Button
          onClick={fetchUsers}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-neon-pink/30 bg-neon-pink/10">
          <CardContent className="pt-6">
            <p className="text-neon-pink">{error}</p>
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
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={Users}
          title="Henüz kullanıcı yok"
          description="Sistemde kayıtlı kullanıcı bulunmuyor"
        />
      ) : (
        /* Premium User List */
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="holographic-hover hover:shadow-glow-cyan transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center shadow-glow-cyan">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                          {user.full_name || 'İsimsiz Kullanıcı'}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {user.company_name && (
                          <div className="flex items-center space-x-2 text-text-muted">
                            <Building2 className="w-4 h-4" />
                            <span>{user.company_name}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-text-muted">
                          <Globe className="w-4 h-4" />
                          <span>{user.country}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-text-muted">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      
                      {/* ID Badge */}
                      <div>
                        <Badge variant="outline" className="font-mono text-xs">
                          ID: {user.id.slice(0, 8)}...
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                    className="text-neon-pink hover:bg-neon-pink/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && users.length > 0 && (
        <Card className="bg-surface-elevated/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Toplam Kullanıcı</span>
              <Badge variant="info">{users.length}</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
