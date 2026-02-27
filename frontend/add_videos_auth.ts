import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxoynfnyrietkisnbqwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4b3luZm55cmlldGtpc25icXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTMxNDYsImV4cCI6MjA3OTkyOTE0Nn0.u6W2dhgIqRace2PIGs39Ad2hO_4R_lHXGc9__3Oa0lo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addVideosToAdmin() {
  try {
    // 1. Admin olarak giriş yap
    console.log('🔐 Admin olarak giriş yapılıyor...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'beratyilmaz626@gmail.com',
      password: 'berat881612'
    });
    
    if (authError) {
      console.log('❌ Giriş hatası:', authError.message);
      return;
    }
    
    console.log('✅ Giriş başarılı! User ID:', authData.user?.id);
    const adminId = authData.user?.id;
    
    if (!adminId) {
      console.log('❌ User ID bulunamadı');
      return;
    }
    
    // 2. Videoları ekle
    const videos = [
      {
        user_id: adminId,
        name: 'UGC Demo Video 1',
        description: 'Profesyonel UGC içerik örneği - Fitness',
        video_url: '/videos/ugc_video_1.mp4',
        thumbnail_url: '',
        status: 'completed',
        views: 125
      },
      {
        user_id: adminId,
        name: 'UGC Demo Video 2', 
        description: 'Profesyonel UGC içerik örneği - Kozmetik',
        video_url: '/videos/ugc_video_2.mp4',
        thumbnail_url: '',
        status: 'completed',
        views: 89
      }
    ];
    
    console.log('📹 Videolar ekleniyor...');
    
    for (const video of videos) {
      // Önce aynı isimde video var mı kontrol et
      const { data: existing } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', adminId)
        .eq('name', video.name)
        .maybeSingle();
      
      if (existing) {
        console.log(`⏭️ "${video.name}" zaten mevcut, atlanıyor...`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('videos')
        .insert(video)
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Hata (${video.name}):`, error.message);
      } else {
        console.log(`✅ Eklendi: ${data.name} (ID: ${data.id})`);
      }
    }
    
    // 3. Tüm videoları listele
    const { data: allVideos, error: listError } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', adminId);
    
    if (!listError) {
      console.log('\n📋 Admin hesabındaki tüm videolar:');
      allVideos?.forEach(v => {
        console.log(`  - ${v.name} (${v.status}, ${v.views} views)`);
      });
    }
    
    console.log('\n🎉 İşlem tamamlandı!');
    
  } catch (err) {
    console.error('❌ Hata:', err);
  }
}

addVideosToAdmin();
