import { environment } from "@/configs/environment";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Opsi untuk pembuatan Supabase client di sisi server.
 */
type CreateClientOptions = {
  /**
   * Jika `true`, client akan dibuat dengan `SUPABASE_SERVICE_ROLE_KEY`
   * yang memberikan hak akses penuh (bypass RLS). Gunakan dengan hati-hati.
   * Jika `false` (default), client akan dibuat dengan `SUPABASE_ANON_KEY`
   * yang tunduk pada Row Level Security (RLS).
   */
  isAdmin?: boolean;
};

/**
 * Membuat instance Supabase client untuk digunakan di sisi server (Server Components, Route Handlers, Server Actions).
 *
 * Fungsi ini secara dinamis membuat client Supabase yang sesuai dengan konteks server:
 * - Menggunakan `cookies()` dari `next/headers` untuk mengelola sesi pengguna secara aman.
 * - Dapat membuat client dengan hak akses admin (`service_role`) jika diperlukan,
 *   yang berguna untuk operasi yang memerlukan hak istimewa.
 *
 * @param {CreateClientOptions} options - Opsi untuk mengonfigurasi client, seperti `isAdmin`.
 * @returns {SupabaseClient} Instance dari Supabase client untuk server.
 *
 * @example
 * // Penggunaan standar di Server Component (sebagai pengguna biasa)
 * import { createClient } from '@/lib/supabase/server';
 *
 * const supabase = createClient({});
 * const { data: { user } } = await supabase.auth.getUser();
 *
 * @example
 * // Penggunaan sebagai admin (misalnya, di Route Handler untuk tugas internal)
 * import { createClient } from '@/lib/supabase/server';
 *
 * const supabaseAdmin = createClient({ isAdmin: true });
 * // Operasi ini akan melewati RLS
 * const { data, error } = await supabaseAdmin.from('profiles').select('*');
 */
export async function createClient({ isAdmin = false }: CreateClientOptions) {
  // Mengambil cookie store dari Next.js. Ini hanya bisa dilakukan di lingkungan server.
  const cookieStore = await cookies();

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    environment;

  // Validasi bahwa variabel lingkungan yang diperlukan tersedia.
  // Ini mencegah error runtime yang tidak jelas jika variabel lupa diatur.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase URL, Anon Key, and Service Role Key must be defined in environment variables."
    );
  }

  // Membuat instance Supabase client untuk server.
  return createServerClient(
    SUPABASE_URL,
    // Memilih kunci API berdasarkan flag `isAdmin`.
    // Gunakan service role key untuk hak akses admin, atau anon key untuk hak akses pengguna biasa.
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Mengambil semua cookie dari cookie store.
         * Supabase akan menggunakan ini untuk membaca sesi pengguna.
         */
        getAll() {
          return cookieStore.getAll();
        },
        /**
         * Mengatur cookie yang diperbarui oleh Supabase.
         * Ini akan menulis kembali cookie ke browser melalui Next.js.
         */
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Penanganan error jika `cookieStore.set` gagal.
            // Ini bisa terjadi jika fungsi ini dipanggil di luar konteks request-response
            // (misalnya, selama build time).
            console.error("Error setting cookies:", cookiesToSet, error);
          }
        },
      },
    }
  );
}
