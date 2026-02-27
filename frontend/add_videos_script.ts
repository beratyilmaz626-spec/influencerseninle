import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxoynfnyrietkisnbqwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4b3luZm55cmlldGtpc25icXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTMxNDYsImV4cCI6MjA3OTkyOTE0Nn0.u6W2dhgIqRace2PIGs39Ad2hO_4R_lHXGc9__3Oa0lo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addVideosToAdmin() {
  try {
    console.log('🔍 Admin kullanıcısı aranıyor...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, is_admin')
      .eq('email', 'beratyilmaz626@gmail.com')
      .single();
    
    if (userError) {
      console.log('❌ Kullanıcı bulunamadı:', userError.message);
      return;
    }
    
    console.log('✅ Admin bulundu:', users);
    const adminId = users.id;
    
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
      const { data: existing } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', adminId)
        .eq('name', video.name)
        .single();
      
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
    
    console.log('🎉 İşlem tamamlandı!');
    
  } catch (err) {
    console.error('❌ Hata:', err);
  }
}

addVideosToAdmin();
