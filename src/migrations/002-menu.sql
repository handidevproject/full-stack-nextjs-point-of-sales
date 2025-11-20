-- ============================================
-- 1. Membuat tabel menus
-- ============================================
-- Tabel ini menyimpan data menu (makanan/minuman)
-- Kolom id = primary key (auto increment)
-- created_at & updated_at otomatis menggunakan zona waktu UTC
CREATE TABLE public.menus (
                              id serial NOT NULL,                                -- ID unik untuk tiap menu
                              name TEXT,                                         -- Nama menu
                              description TEXT,                                  -- Deskripsi makanan/minuman
                              price NUMERIC,                                     -- Harga menu
                              discount NUMERIC,                                  -- Diskon (jika ada)
                              image_url TEXT,                                    -- URL gambar menu di Supabase Storage
                              category TEXT,                                     -- Kategori menu
                              is_available BOOLEAN,                              -- Status ketersediaan menu
                              created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, -- Waktu dibuat
                              updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, -- Waktu diupdate
                              PRIMARY KEY (id)                                   -- Menetapkan id sebagai primary key
);

-- ============================================
-- 2. Mengaktifkan Row Level Security (RLS)
-- ============================================
-- Dengan RLS aktif, semua akses SELECT/INSERT/UPDATE/DELETE
-- harus mengikuti policy yang dibuat.
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;


-- ============================================
-- 3. Melihat policy yang sudah ada (opsional)
-- ============================================
SELECT * FROM pg_policies;


-- ============================================
-- 4. Menghapus policy lama (jika ada)
-- Ini untuk memastikan tidak ada policy yang bentrok
-- sebelum membuat policy baru.
-- ============================================
DROP POLICY IF EXISTS public_select_menus ON public.menus;
DROP POLICY IF EXISTS auth_write_menus ON public.menus;


-- ============================================
-- 5. Policy: Mengizinkan SELECT (baca) untuk publik
-- ============================================
-- Policy ini membuat semua user (termasuk anon) dapat membaca tabel menus.
-- Cocok jika data menu memang boleh ditampilkan di website/app.
CREATE POLICY public_select_menus
  ON public.menus
  FOR SELECT
                           USING (true); -- Selalu true = semua boleh membaca


-- ============================================
-- 6. Policy: Mengizinkan user login untuk INSERT/UPDATE/DELETE
-- ============================================
-- Policy ini memberikan akses penuh pada user yang terautentikasi (authenticated).
-- INSERT: hanya boleh jika auth.uid() tidak NULL (berarti user login)
-- UPDATE: hanya boleh jika auth.uid() tidak NULL
-- DELETE: hanya boleh jika auth.uid() tidak NULL
CREATE POLICY auth_write_menus
  ON public.menus
  FOR ALL                -- Berlaku untuk INSERT, UPDATE, DELETE
  TO authenticated       -- Hanya user login (authenticated role)
  USING (auth.uid() IS NOT NULL)       -- Cek akses terhadap row existing
  WITH CHECK (auth.uid() IS NOT NULL); -- Cek akses terhadap row baru


-- =============================================================
-- 7. STORAGE POLICY (Bucket: images)
-- Storage menggunakan tabel storage.objects sebagai backend
-- RLS juga berlaku di sini, jadi harus dibuat policy khusus bucket
-- =============================================================

-- INSERT: Mengizinkan user login meng-upload file ke bucket 'images'
CREATE POLICY allow_insert_user_uploads
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND auth.uid() IS NOT NULL
  );

-- SELECT: Mengizinkan baca file jika:
-- 1. File berada di bucket 'images' (public)
-- 2. ATAU file dimiliki oleh user (owner = auth.uid())
CREATE POLICY select_public_or_owner
  ON storage.objects
  FOR SELECT
                               USING (
                               bucket_id = 'images' OR owner = auth.uid()
                               );

-- DELETE: hanya pemilik file (owner) yang boleh menghapus file
CREATE POLICY delete_only_owner
  ON storage.objects
  FOR DELETE
USING (owner = auth.uid());

-- UPDATE: hanya pemilik file boleh mengubah metadata/path
CREATE POLICY update_only_owner
  ON storage.objects
  FOR UPDATE
                 USING (owner = auth.uid())           -- Boleh update jika pemiliknya
      WITH CHECK (owner = auth.uid());     -- Baris setelah update juga harus tetap pemiliknya sama


-- ============================================
-- 8. Query Debug: melihat file di bucket 'images'
-- ============================================
SELECT * FROM storage.objects WHERE bucket_id = 'images' LIMIT 10;
