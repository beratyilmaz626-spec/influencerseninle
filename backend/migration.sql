
-- 1. Users Tablosu
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UGC Tasks Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    media_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UGC Orders Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    content_type TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UGC Media Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.ugc_orders(id),
    media_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Logs Tablosu
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin kullanıcı oluştur
INSERT INTO public.users (email, password, role)
VALUES ('beratyilmaz626@gmail.com', 'berat881612', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
