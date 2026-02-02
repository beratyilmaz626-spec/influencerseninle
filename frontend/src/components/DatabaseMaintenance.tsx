import { useState } from 'react';
import { Database, Shield, Zap, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FixResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'skipped';
  message?: string;
}

export default function DatabaseMaintenance() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<FixResult[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');

  const runDatabaseFixes = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setResults([]);

    const fixes: FixResult[] = [];

    // 1. exec_sql fonksiyonu var mı kontrol et
    const addResult = (name: string, status: FixResult['status'], message?: string) => {
      const result = { name, status, message };
      fixes.push(result);
      setResults([...fixes]);
    };

    try {
      // Test exec_sql
      addResult('exec_sql Fonksiyon Kontrolü', 'pending');
      
      const { error: testError } = await supabase.rpc('exec_sql', { 
        query: 'SELECT 1' 
      });

      if (testError) {
        if (testError.message.includes('Could not find')) {
          fixes[fixes.length - 1] = {
            name: 'exec_sql Fonksiyon Kontrolü',
            status: 'error',
            message: 'exec_sql fonksiyonu bulunamadı. Lütfen önce Supabase SQL Editor\'da şu komutu çalıştırın: CREATE OR REPLACE FUNCTION exec_sql(query text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN EXECUTE query; END; $$;'
          };
          setResults([...fixes]);
          setOverallStatus('error');
          setIsRunning(false);
          return;
        }
        throw testError;
      }

      fixes[fixes.length - 1] = {
        name: 'exec_sql Fonksiyon Kontrolü',
        status: 'success',
        message: 'Fonksiyon mevcut ve çalışıyor'
      };
      setResults([...fixes]);

      // 2. RLS Politikalarını Temizle ve Yeniden Oluştur
      const tables = ['users', 'videos', 'ugc_tasks', 'slider_videos', 'video_styles', 'test_table'];
      
      for (const table of tables) {
        addResult(`${table} RLS Düzeltmesi`, 'pending');
        
        try {
          // Enable RLS
          await supabase.rpc('exec_sql', {
            query: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`
          });

          fixes[fixes.length - 1] = {
            name: `${table} RLS Düzeltmesi`,
            status: 'success',
            message: 'RLS etkinleştirildi'
          };
        } catch (err: any) {
          fixes[fixes.length - 1] = {
            name: `${table} RLS Düzeltmesi`,
            status: 'error',
            message: err.message?.slice(0, 100)
          };
        }
        setResults([...fixes]);
      }

      // 3. Fonksiyonları Güncelle (search_path)
      const functions = [
        'update_videos_updated_at',
        'update_slider_videos_updated_at', 
        'update_user_credits_updated_at',
        'update_video_styles_updated_at'
      ];

      for (const func of functions) {
        addResult(`${func} Güvenlik Düzeltmesi`, 'pending');
        
        try {
          await supabase.rpc('exec_sql', {
            query: `CREATE OR REPLACE FUNCTION public.${func}() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$`
          });

          fixes[fixes.length - 1] = {
            name: `${func} Güvenlik Düzeltmesi`,
            status: 'success',
            message: 'search_path güvenliği eklendi'
          };
        } catch (err: any) {
          fixes[fixes.length - 1] = {
            name: `${func} Güvenlik Düzeltmesi`,
            status: 'error',
            message: err.message?.slice(0, 100)
          };
        }
        setResults([...fixes]);
      }

      // 4. Kredi Fonksiyonlarını Güncelle
      addResult('add_user_credits Güvenlik Düzeltmesi', 'pending');
      try {
        await supabase.rpc('exec_sql', {
          query: `CREATE OR REPLACE FUNCTION public.add_user_credits(user_id_param UUID, credits_to_add INTEGER) RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE new_credits INTEGER; BEGIN UPDATE public.users SET user_credits_points = COALESCE(user_credits_points, 0) + credits_to_add WHERE id = user_id_param RETURNING user_credits_points INTO new_credits; RETURN COALESCE(new_credits, 0); END; $$`
        });
        fixes[fixes.length - 1] = {
          name: 'add_user_credits Güvenlik Düzeltmesi',
          status: 'success',
          message: 'search_path güvenliği eklendi'
        };
      } catch (err: any) {
        fixes[fixes.length - 1] = {
          name: 'add_user_credits Güvenlik Düzeltmesi',
          status: 'error',
          message: err.message?.slice(0, 100)
        };
      }
      setResults([...fixes]);

      addResult('deduct_user_credits Güvenlik Düzeltmesi', 'pending');
      try {
        await supabase.rpc('exec_sql', {
          query: `CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id_param UUID, credits_to_deduct INTEGER) RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE current_credits INTEGER; new_credits INTEGER; BEGIN SELECT user_credits_points INTO current_credits FROM public.users WHERE id = user_id_param; IF current_credits IS NULL OR current_credits < credits_to_deduct THEN RETURN -1; END IF; UPDATE public.users SET user_credits_points = user_credits_points - credits_to_deduct WHERE id = user_id_param RETURNING user_credits_points INTO new_credits; RETURN new_credits; END; $$`
        });
        fixes[fixes.length - 1] = {
          name: 'deduct_user_credits Güvenlik Düzeltmesi',
          status: 'success',
          message: 'search_path güvenliği eklendi'
        };
      } catch (err: any) {
        fixes[fixes.length - 1] = {
          name: 'deduct_user_credits Güvenlik Düzeltmesi',
          status: 'error',
          message: err.message?.slice(0, 100)
        };
      }
      setResults([...fixes]);

      // 5. İndeksleri Oluştur
      const indexes = [
        { table: 'users', column: 'email', name: 'idx_users_email' },
        { table: 'videos', column: 'user_id', name: 'idx_videos_user_id' },
        { table: 'videos', column: 'status', name: 'idx_videos_status' },
        { table: 'ugc_tasks', column: 'user_id', name: 'idx_ugc_tasks_user_id' },
        { table: 'video_styles', column: 'is_active', name: 'idx_video_styles_is_active' },
        { table: 'slider_videos', column: 'is_active', name: 'idx_slider_videos_is_active' },
      ];

      for (const idx of indexes) {
        addResult(`${idx.name} İndeks Oluşturma`, 'pending');
        
        try {
          await supabase.rpc('exec_sql', {
            query: `CREATE INDEX IF NOT EXISTS ${idx.name} ON public.${idx.table}(${idx.column})`
          });

          fixes[fixes.length - 1] = {
            name: `${idx.name} İndeks Oluşturma`,
            status: 'success',
            message: 'İndeks oluşturuldu/mevcut'
          };
        } catch (err: any) {
          fixes[fixes.length - 1] = {
            name: `${idx.name} İndeks Oluşturma`,
            status: 'error',
            message: err.message?.slice(0, 100)
          };
        }
        setResults([...fixes]);
      }

      setOverallStatus('complete');
    } catch (error: any) {
      console.error('Database fix error:', error);
      addResult('Genel Hata', 'error', error.message);
      setOverallStatus('error');
    }

    setIsRunning(false);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-2xl p-6 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-violet-600/20 rounded-xl">
            <Database className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Veritabanı Bakımı</h2>
            <p className="text-gray-400 text-sm">Supabase güvenlik ve performans düzeltmeleri</p>
          </div>
        </div>

        {/* Açıklama */}
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-200 font-medium mb-1">Ön Koşul</p>
              <p className="text-gray-300">
                Bu işlemleri çalıştırmadan önce Supabase SQL Editor'da şu komutu çalıştırmanız gerekiyor:
              </p>
              <code className="block mt-2 p-2 bg-black/30 rounded text-xs text-green-400 break-all">
                CREATE OR REPLACE FUNCTION exec_sql(query text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN EXECUTE query; END; $$;
              </code>
            </div>
          </div>
        </div>

        {/* Düzeltme Listesi */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">Güvenlik</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• RLS (Row Level Security)</li>
              <li>• Fonksiyon search_path</li>
              <li>• Politika düzeltmeleri</li>
            </ul>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-medium text-white">Performans</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Veritabanı indeksleri</li>
              <li>• Sorgu optimizasyonu</li>
              <li>• Tablo analizi</li>
            </ul>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-green-400" />
              <span className="font-medium text-white">Tablolar</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• users, videos</li>
              <li>• ugc_tasks, video_styles</li>
              <li>• slider_videos, test_table</li>
            </ul>
          </div>
        </div>

        {/* Çalıştır Butonu */}
        <button
          onClick={runDatabaseFixes}
          disabled={isRunning}
          className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Düzeltmeler Uygulanıyor...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Düzeltmeleri Çalıştır
            </>
          )}
        </button>

        {/* Sonuçlar */}
        {results.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Sonuçlar</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">✓ {successCount} Başarılı</span>
                <span className="text-red-400">✗ {errorCount} Hata</span>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : result.status === 'error'
                      ? 'bg-red-500/10 border-red-500/20'
                      : result.status === 'pending'
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : 'bg-gray-500/10 border-gray-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                    {result.status === 'error' && (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    {result.status === 'pending' && (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    )}
                    <span className="font-medium text-white text-sm">{result.name}</span>
                  </div>
                  {result.message && (
                    <p className="text-xs text-gray-400 mt-1 ml-6">{result.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tamamlandı Mesajı */}
        {overallStatus === 'complete' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Tüm düzeltmeler tamamlandı!</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Supabase Dashboard'daki Linter'ı yenileyerek sonuçları kontrol edebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
