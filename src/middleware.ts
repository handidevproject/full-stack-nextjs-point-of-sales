import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware Next.js untuk mengelola sesi pengguna dengan Supabase.
 *
 * Middleware ini akan dijalankan untuk setiap permintaan (request) yang masuk ke aplikasi.
 * Fungsi utamanya adalah memanggil `updateSession` dari Supabase, yang bertugas untuk
 * me-refresh token sesi pengguna jika diperlukan. Ini memastikan bahwa sesi pengguna
 * tetap valid saat mereka menjelajahi aplikasi.
 *
 * @param {NextRequest} request - Objek request yang masuk dari Next.js.
 * @returns {Promise<NextResponse>} Response yang dihasilkan oleh `updateSession`,
 *   yang biasanya merupakan response asli dengan cookie sesi yang diperbarui.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  // Memanggil fungsi `updateSession` untuk menyegarkan sesi pengguna di setiap request.
  // Ini adalah inti dari otentikasi sisi server dengan Supabase di Next.js.
  return await updateSession(request);
}

/**
 * Konfigurasi matcher untuk middleware.
 *
 * `matcher` menentukan path mana saja yang akan dieksekusi oleh middleware.
 * Pola di bawah ini dirancang untuk menjalankan middleware di semua path,
 * KECUALI untuk file statis seperti gambar, file build Next.js, dan favicon.
 * Ini adalah praktik umum untuk menghindari overhead yang tidak perlu pada aset statis.
 *
 * Pola regex:
 * - `^`: Mulai dari awal string.
 * - `(?!...)`: Negative lookahead, memastikan string tidak cocok dengan pola di dalamnya.
 *   - `_next/static`: File aset statis Next.js.
 *   - `_next/image`: File optimasi gambar Next.js.
 *   - `favicon.ico`: Ikon favorit.
 *   - `.*\\.(?:svg|png|jpg|jpeg|gif|webp)$`: Semua file yang berakhiran dengan ekstensi gambar.
 * - `.*`: Cocok dengan karakter apa pun.
 * - `$`: Akhir dari string.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
