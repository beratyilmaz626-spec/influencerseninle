import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vkokxnbkebqmlpsnfiih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb2t4bmJrZWJxbWxwc25maWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTkwOTUsImV4cCI6MjA3NTgzNTA5NX0.-TWmr11KjgpukEs3KWHKnOI2D4VI3xbktTwzdhZYsMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdate() {
  console.log('🔧 ID ile direkt güncelleme yapıyorum...');
  
  const { data, error } = await supabase
    .from('video_styles')
    .update({
      name: 'Fish Eye',
      image: '/fisheye.mp4',
      prompt: 'Fish Eye kamera açısıyla çekilmiş geniş açı video',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'cb2cbef9-0bc4-496d-b2b9-3f4b5f9bf2fc')
    .select();
  
  if (error) {
    console.error('❌ Güncelleme hatası:', error.message);
    console.error('Detay:', error);
  } else {
    console.log('✅ Başarıyla güncellendi!');
    console.log('📄 Güncel veri:', data);
  }
}

forceUpdate();
