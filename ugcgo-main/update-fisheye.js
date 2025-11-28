const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vkokxnbkebqmlpsnfiih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb2t4bmJrZWJxbWxwc25maWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTkwOTUsImV4cCI6MjA3NTgzNTA5NX0.-TWmr11KjgpukEs3KWHKnOI2D4VI3xbktTwzdhZYsMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFitnessToFishEye() {
  console.log('🔍 Fitness videosunu arıyorum...');
  
  // Önce Fitness videosunu bulalım
  const { data: existingVideos, error: fetchError } = await supabase
    .from('video_styles')
    .select('*')
    .or('name.ilike.%fitness%,name.ilike.%Fitness%');
  
  if (fetchError) {
    console.error('❌ Hata:', fetchError);
    return;
  }
  
  console.log('📹 Bulunan videolar:', existingVideos);
  
  if (existingVideos && existingVideos.length > 0) {
    const fitnessVideo = existingVideos[0];
    console.log('✅ Fitness videosu bulundu, güncelleniyor...');
    
    // Güncelleme yap
    const { data, error } = await supabase
      .from('video_styles')
      .update({
        name: 'Fish Eye',
        image: '/fisheye.mp4',
        prompt: 'Fish Eye kamera açısıyla çekilmiş geniş açı video'
      })
      .eq('id', fitnessVideo.id)
      .select();
    
    if (error) {
      console.error('❌ Güncelleme hatası:', error);
    } else {
      console.log('✅ Başarıyla güncellendi!');
      console.log('📄 Güncel veri:', data);
    }
  } else {
    console.log('⚠️ Fitness videosu bulunamadı. Tüm videoları listeliyorum...');
    
    const { data: allVideos, error: allError } = await supabase
      .from('video_styles')
      .select('*');
    
    if (!allError) {
      console.log('📋 Tüm videolar:', allVideos);
    }
  }
}

updateFitnessToFishEye();
