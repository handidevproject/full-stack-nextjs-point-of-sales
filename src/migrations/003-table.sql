create table public.tables (
                               id serial not null,
                               name text,
                               description text,
                               capacity numeric,
                               status text,
                               created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                               updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

                               primary key (id)
);


-- Aktifkan RLS
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama kalau ada
DROP POLICY IF EXISTS public_select_tables ON public.tables;
DROP POLICY IF EXISTS auth_insert_tables ON public.tables;
DROP POLICY IF EXISTS auth_update_tables ON public.tables;
DROP POLICY IF EXISTS auth_delete_tables ON public.tables;

-- 1. SELECT: semua boleh melihat data tables
CREATE POLICY public_select_tables
  ON public.tables
  FOR SELECT
                                     USING (true);

-- 2. INSERT: hanya user login boleh insert
CREATE POLICY auth_insert_tables
  ON public.tables
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. UPDATE: hanya user login boleh update
CREATE POLICY auth_update_tables
  ON public.tables
  FOR UPDATE
                        TO authenticated
                        USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);

-- 4. DELETE: hanya user login boleh delete
CREATE POLICY auth_delete_tables
  ON public.tables
  FOR DELETE
TO authenticated
  USING (auth.uid() IS NOT NULL);
