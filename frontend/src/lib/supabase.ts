import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
  });
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Upload file to Supabase Storage
export const uploadVideoFile = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(data.path);

  return publicUrl;
};

// Upload thumbnail to Supabase Storage
export const uploadThumbnailFile = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `thumbnails/${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Thumbnail upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(data.path);

  return publicUrl;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          country: string;
          is_admin: boolean;
          user_credits_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          country?: string;
          is_admin?: boolean;
          user_credits_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          country?: string;
          is_admin?: boolean;
          user_credits_points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'signup_bonus' | 'video_creation' | 'refund';
          description: string;
          stripe_order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'signup_bonus' | 'video_creation' | 'refund';
          description: string;
          stripe_order_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'purchase' | 'signup_bonus' | 'video_creation' | 'refund';
          description?: string;
          stripe_order_id?: string | null;
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: 'processing' | 'completed' | 'failed';
          duration: string;
          views: number;
          product_url: string | null;
          product_name: string | null;
          selected_style: string | null;
          selected_voice: string | null;
          script_content: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: 'processing' | 'completed' | 'failed';
          duration?: string;
          views?: number;
          product_url?: string | null;
          product_name?: string | null;
          selected_style?: string | null;
          selected_voice?: string | null;
          script_content?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: 'processing' | 'completed' | 'failed';
          duration?: string;
          views?: number;
          product_url?: string | null;
          product_name?: string | null;
          selected_style?: string | null;
          selected_voice?: string | null;
          script_content?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      slider_videos: {
        Row: {
          id: string;
          title: string;
          video_url: string;
          thumbnail_url: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          video_url: string;
          thumbnail_url?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};