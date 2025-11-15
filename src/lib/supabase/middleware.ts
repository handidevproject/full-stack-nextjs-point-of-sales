import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Memperbarui sesi pengguna Supabase dan menangani logika otentikasi di middleware.
 *
 * Fungsi ini melakukan beberapa hal penting:
 * 1. Membuat Supabase client khusus untuk lingkungan server (middleware).
 * 2. Mengambil informasi pengguna dari sesi yang ada (melalui cookie).
 * 3. Melindungi rute:
 *    - Jika pengguna belum login dan mencoba mengakses rute selain `/login`,
 *      mereka akan diarahkan ke halaman login.
 *    - Jika pengguna sudah login dan mencoba mengakses halaman `/login`,
 *      mereka akan diarahkan ke halaman utama (`/`).
 * 4. Menyegarkan dan meneruskan cookie sesi ke response, memastikan pengguna tetap login.
 *
 * @param {NextRequest} request - Objek request yang masuk dari Next.js.
 * @returns {Promise<NextResponse>} Response yang dimodifikasi dengan cookie sesi yang diperbarui
 *   atau response redirect jika diperlukan.
 */
export async function updateSession(request: NextRequest) {
  // Membuat response awal yang akan dimodifikasi.
  // Ini memungkinkan kita untuk membaca dan menulis cookie.
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment;

  // Membuat instance Supabase client untuk server-side rendering (SSR).
  // Client ini dikonfigurasi untuk bekerja dengan cookie dari request dan response.
  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      /**
       * Mengambil semua cookie dari request yang masuk.
       * Supabase client akan menggunakan ini untuk membaca sesi yang ada.
       */
      getAll() {
        return request.cookies.getAll();
      },
      /**
       * Mengatur cookie yang perlu diperbarui di request dan response.
       * Supabase memanggil fungsi ini setelah sesi disegarkan.
       */
      setAll(cookiesToSet) {
        // Menambahkan cookie ke objek request agar bisa diakses di rute selanjutnya.
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        // Membuat ulang response untuk memastikan header `request` yang diperbarui digunakan.
        supabaseResponse = NextResponse.next({
          request,
        });
        // Menambahkan cookie ke header `Set-Cookie` pada response yang akan dikirim ke browser.
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Mengambil informasi pengguna saat ini dari Supabase.
  // Ini akan secara otomatis menyegarkan token jika perlu.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logika perlindungan rute (Route Protection)
  // Jika tidak ada pengguna (belum login) dan path bukan '/login', arahkan ke '/login'.
  if (!user && request.nextUrl.pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika pengguna sudah login dan mencoba mengakses '/login', arahkan ke halaman utama.
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Mengembalikan response yang sudah diperbarui dengan cookie sesi yang benar.
  return supabaseResponse;
}
