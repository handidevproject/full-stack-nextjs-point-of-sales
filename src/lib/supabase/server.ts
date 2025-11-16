/**
 * @file Utilitas untuk membuat Supabase client di lingkungan server Next.js.
 */

import { environment } from "@/configs/environment";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreateClientOptions = {
  /**
   * Jika `true`, client akan dibuat dengan hak akses admin (service role),
   * yang dapat melewati Row Level Security (RLS). Gunakan dengan hati-hati.
   * Defaultnya `false`.
   */
  isAdmin?: boolean;
};

/**
 * Membuat Supabase client untuk digunakan di sisi server (Server Components, Actions, Route Handlers).
 *
 * Fungsi ini secara otomatis mengelola cookie untuk otentikasi.
 *
 * @param {CreateClientOptions} [options={}] - Opsi untuk pembuatan client.
 * @returns Supabase client yang siap digunakan.
 *
 * @example
 * // Membuat client standar (sebagai pengguna)
 * const supabase = createClient();
 * const { data } = await supabase.from('posts').select('*');
 *
 * @example
 * // Membuat client dengan hak akses admin
 * const supabaseAdmin = createClient({ isAdmin: true });
 * const { data } = await supabaseAdmin.from('users').select('*'); // Melewati RLS
 */
export async function createClient({ isAdmin = false }: CreateClientOptions = {}) {
  const cookieStore = await cookies();

  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    environment;
  console.log(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY);

  // Validasi variabel lingkungan untuk mencegah error saat runtime
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Variabel lingkungan Supabase belum diatur dengan benar.");
  }

  return createServerClient(
    SUPABASE_URL,
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY,
    {
      cookies: {
        // Fungsi untuk mengambil cookie dari request
        getAll() {
          return cookieStore.getAll();
        },
        // Fungsi untuk mengatur cookie di response
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Error ini bisa terjadi jika `set` dipanggil di luar konteks request,
            // misalnya saat build. Cukup log error tanpa menghentikan aplikasi.
          }
        },
      },
    }
  );
}
