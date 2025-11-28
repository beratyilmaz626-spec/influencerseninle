import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vkokxnbkebqmlpsnfiih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb2t4bmJrZWJxbWxwc25maWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTkwOTUsImV4cCI6MjA3NTgzNTA5NX0.-TWmr11KjgpukEs3KWHKnOI2D4VI3xbktTwzdhZYsMM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFishEye() {
  const { data, error } = await supabase
    .from('video_styles')
    .select('*')
    .or('name.ilike.%fish%,name.ilike.%Fish%');
  
  if (error) {
    console.error('❌ Hata:', error);
  } else {
    console.log('🎣 Fish Eye videosu:', data);
  }
}

checkFishEye();
