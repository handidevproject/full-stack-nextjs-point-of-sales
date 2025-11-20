-- ================================
-- Create tables (orders, orders_menus)
-- ================================
CREATE TABLE public.orders (
                               id serial NOT NULL,
                               order_id text,
                               customer_name text,
                               status text,
                               payment_url text,
                               table_id integer REFERENCES public.tables(id) ON DELETE SET NULL,
                               created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
                               updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
                               PRIMARY KEY (id)
);

CREATE TABLE public.orders_menus (
                                     id serial NOT NULL,
                                     order_id integer REFERENCES public.orders(id) ON DELETE SET NULL,
                                     menu_id integer REFERENCES public.menus(id) ON DELETE SET NULL,
                                     status text,
                                     quantity integer,
                                     notes text,
                                     created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
                                     updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
                                     PRIMARY KEY (id)
);

-- ================================
-- Enable Row Level Security
-- ================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_menus ENABLE ROW LEVEL SECURITY;

-- ================================
-- Orders policies
-- ================================
-- Drop existing policies if any
DROP POLICY IF EXISTS public_select_orders ON public.orders;
DROP POLICY IF EXISTS auth_insert_orders ON public.orders;
DROP POLICY IF EXISTS auth_update_orders ON public.orders;
DROP POLICY IF EXISTS auth_delete_orders ON public.orders;
DROP POLICY IF EXISTS admin_all_orders ON public.orders;

-- 1) SELECT: publik (siapa saja boleh baca)
CREATE POLICY public_select_orders
  ON public.orders
  FOR SELECT
                                          USING (true);

-- 2) INSERT: hanya user terautentikasi boleh insert
CREATE POLICY auth_insert_orders
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3) UPDATE: hanya user terautentikasi boleh update
CREATE POLICY auth_update_orders
  ON public.orders
  FOR UPDATE
                        TO authenticated
                        USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);

-- 4) DELETE: hanya user terautentikasi boleh delete
CREATE POLICY auth_delete_orders
  ON public.orders
  FOR DELETE
TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Optional: admin full access (jika JWT punya claim role = 'admin')
-- Policy ini akan mengizinkan request yang memiliki claim role = 'admin' (di JWT)
CREATE POLICY admin_all_orders
  ON public.orders
  FOR ALL
  USING (current_setting('request.jwt.claims.role', true) = 'admin')
  WITH CHECK (current_setting('request.jwt.claims.role', true) = 'admin');


-- ================================
-- Orders_menus policies
-- ================================
-- Drop existing policies if any
DROP POLICY IF EXISTS public_select_orders_menus ON public.orders_menus;
DROP POLICY IF EXISTS auth_insert_orders_menus ON public.orders_menus;
DROP POLICY IF EXISTS auth_update_orders_menus ON public.orders_menus;
DROP POLICY IF EXISTS auth_delete_orders_menus ON public.orders_menus;
DROP POLICY IF EXISTS admin_all_orders_menus ON public.orders_menus;

-- 1) SELECT: publik (siapa saja boleh baca)
CREATE POLICY public_select_orders_menus
  ON public.orders_menus
  FOR SELECT
                                                 USING (true);

-- 2) INSERT: hanya user terautentikasi boleh insert
CREATE POLICY auth_insert_orders_menus
  ON public.orders_menus
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3) UPDATE: hanya user terautentikasi boleh update
CREATE POLICY auth_update_orders_menus
  ON public.orders_menus
  FOR UPDATE
                        TO authenticated
                        USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);

-- 4) DELETE: hanya user terautentikasi boleh delete
CREATE POLICY auth_delete_orders_menus
  ON public.orders_menus
  FOR DELETE
TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Optional: admin full access for orders_menus (if using JWT role claim)
CREATE POLICY admin_all_orders_menus
  ON public.orders_menus
  FOR ALL
  USING (current_setting('request.jwt.claims.role', true) = 'admin')
  WITH CHECK (current_setting('request.jwt.claims.role', true) = 'admin');

-- ================================
-- Finished — optional: check policies
-- ================================
-- SELECT * FROM pg_policies WHERE schemaname='public' AND tablename IN ('orders','orders_menus');
