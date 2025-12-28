import { useState, useEffect } from 'react';
import { Gift, Search, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface UserItem {
  id: string;
  email: string;
  credits: number;
}

export default function GiftTokenManager() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [videoCount, setVideoCount] = useState(1);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${backendUrl}/api/subscription/admin/users`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGiftToken = async () => {
    if (!selectedUser) return;

    try {
      setSending(true);
      setMessage(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${backendUrl}/api/subscription/admin/gift-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          user_email: selectedUser.email,
          video_count: videoCount
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        setSelectedUser(null);
        setVideoCount(1);
        fetchUsers(); // Refresh user list
      } else {
        setMessage({ type: 'error', text: data.detail || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Hediye Token Yönetimi</h2>
          <p className="text-sm text-text-secondary">Kullanıcılara video hakkı hediye edin</p>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
              {message.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Form */}
      <div className="bg-surface-elevated/50 backdrop-blur-sm rounded-2xl border border-white/5 p-4 sm:p-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Email ile kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
        </div>

        {/* User List */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              {searchTerm ? 'Kullanıcı bulunamadı' : 'Henüz kullanıcı yok'}
            </div>
          ) : (
            filteredUsers.map(user => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  selectedUser?.id === user.id
                    ? 'bg-accent-primary/20 border border-accent-primary/50'
                    : 'bg-surface/30 border border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-sm sm:text-base">{user.email}</p>
                    <p className="text-xs text-text-secondary">Mevcut hak: {user.credits} video</p>
                  </div>
                </div>
                {selectedUser?.id === user.id && (
                  <CheckCircle className="w-5 h-5 text-accent-primary" />
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Video Count & Submit */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-sm text-text-secondary mb-2">
                  Hediye edilecek video sayısı
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={videoCount}
                  onChange={(e) => setVideoCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                />
              </div>
              <div className="w-full sm:w-auto sm:pt-7">
                <button
                  onClick={handleGiftToken}
                  disabled={sending}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Gift className="w-5 h-5" />
                  )}
                  Hediye Gönder
                </button>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-accent-primary">{selectedUser.email}</span> kullanıcısına{' '}
              <span className="font-medium text-text-primary">{videoCount}</span> video hakkı hediye edilecek.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
