/*
  # Kullanıcılar Tablosu Oluştur

  1. Yeni Tablolar
    - `users`
      - `id` (uuid, primary key) - Supabase auth.users ile eşleşir
      - `email` (text, unique) - Kullanıcı e-posta adresi
      - `full_name` (text) - Kullanıcının tam adı
      - `company_name` (text, nullable) - Şirket adı (isteğe bağlı)
      - `country` (text) - Ülke bilgisi
      - `created_at` (timestamp) - Kayıt tarihi
      - `updated_at` (timestamp) - Son güncelleme tarihi

  2. Güvenlik
    - `users` tablosunda RLS etkinleştir
    - Kullanıcılar sadece kendi verilerini görebilir ve güncelleyebilir
    - Kayıt sırasında otomatik kullanıcı oluşturma trigger'ı

  3. Trigger Fonksiyonu
    - Supabase auth.users'a kayıt olunduğunda otomatik olarak users tablosuna kayıt ekler
*/

-- Kullanıcılar tablosunu oluştur
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  company_name text,
  country text DEFAULT 'Türkiye',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS'yi etkinleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Kullanıcılar sadece kendi verilerini güncelleyebilir
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kullanıcılar sadece kendi verilerini silebilir
CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Yeni kullanıcı kaydı için trigger fonksiyonu
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth kullanıcısı oluşturulduğunda users tablosuna da ekle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();