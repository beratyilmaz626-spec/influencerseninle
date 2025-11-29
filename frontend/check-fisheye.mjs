import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxoynfnyrietkisnbqwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4b3luZm55cmlldGtpc25icXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTMxNDYsImV4cCI6MjA3OTkyOTE0Nn0.hQ_Z3RFVXTGHjFYGW9_4rE0gUDdYLQn7WP5VbxqVvXg';

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
