-- UGC Project Manager - Tablo Oluşturma SQL
-- Bu SQL'i Supabase Dashboard -> SQL Editor'a yapıştır ve çalıştır

-- 1. Users Tablosu
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UGC Tasks Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
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
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_production', 'completed', 'cancelled')),
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UGC Media Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.ugc_orders(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Logs Tablosu
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Politikaları
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Admin her şeyi görebilir
CREATE POLICY "Admin full access on users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access on ugc_tasks" ON public.ugc_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access on ugc_orders" ON public.ugc_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access on ugc_media" ON public.ugc_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access on logs" ON public.logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Client'lar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can view own tasks" ON public.ugc_tasks
    FOR SELECT USING (user_id = auth.uid());

-- Service role için her şeye erişim
CREATE POLICY "Service role full access users" ON public.users
    FOR ALL USING (true);

CREATE POLICY "Service role full access tasks" ON public.ugc_tasks
    FOR ALL USING (true);

CREATE POLICY "Service role full access orders" ON public.ugc_orders
    FOR ALL USING (true);

CREATE POLICY "Service role full access media" ON public.ugc_media
    FOR ALL USING (true);

CREATE POLICY "Service role full access logs" ON public.logs
    FOR ALL USING (true);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_user_id ON public.ugc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_status ON public.ugc_orders(status);
CREATE INDEX IF NOT EXISTS idx_ugc_media_order_id ON public.ugc_media(order_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
