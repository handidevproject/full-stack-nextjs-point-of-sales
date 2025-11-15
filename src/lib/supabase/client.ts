import { createBrowserClient } from "@supabase/ssr";
import { environment } from "@/configs/environment";

/**
 * Membuat instance Supabase client untuk digunakan di sisi klien (browser).
 *
 * Fungsi ini mengambil URL Supabase dan kunci anon dari variabel lingkungan
 * dan menggunakannya untuk membuat instance client yang aman untuk digunakan di browser.
 * Client ini memungkinkan interaksi dengan database Supabase dari komponen React sisi klien.
 *
 * @returns {SupabaseClient} Instance dari Supabase client untuk browser.
 *
 * @example
 * import { createClient } from '@/lib/supabase/client';
 *
 * const supabase = createClient();
 *
 * // Gunakan client untuk berinteraksi dengan Supabase
 * async function getProducts() {
 *   const { data, error } = await supabase.from('products').select('*');
 *   if (error) console.error('Error fetching products:', error);
 *   else console.log('Products:', data);
 * }
 */
export function createClient() {
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = environment;

  // Pastikan variabel lingkungan tersedia sebelum membuat client
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase URL and Anon Key must be defined in environment variables."
    );
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
