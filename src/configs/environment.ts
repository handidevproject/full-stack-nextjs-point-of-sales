/**
 * @file Konfigurasi variabel lingkungan (environment variables) untuk aplikasi.
 *
 * File ini berfungsi sebagai pusat untuk mengakses semua variabel lingkungan yang dibutuhkan.
 * Dengan mengimpor dari file ini, kita mendapatkan beberapa keuntungan:
 * 1. **IntelliSense**: Autocomplete saat mengetik `environment.`.
 * 2. **Keamanan Tipe**: Meskipun tidak secara eksplisit menggunakan TypeScript di sini,
 *    ini adalah langkah pertama menuju validasi skema lingkungan.
 * 3. **Sentralisasi**: Semua variabel lingkungan didefinisikan di satu tempat,
 *    memudahkan pengelolaan dan pelacakan.
 * 4. **Default Values**: Memberikan nilai default (string kosong) untuk mencegah error
 *    jika variabel tidak ditemukan, meskipun sebaiknya divalidasi di tempat lain.
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

export const environment = {
  /**
   * URL proyek Supabase Anda.
   * Variabel ini aman untuk diekspos di sisi klien (browser).
   * Awalan `NEXT_PUBLIC_` membuatnya tersedia di browser.
   *
   * @type {string}
   */
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",

  /**
   * Kunci "anon" (anonim) untuk proyek Supabase Anda.
   * Kunci ini aman untuk diekspos di sisi klien dan digunakan untuk otentikasi
   * serta akses data yang diatur oleh Row Level Security (RLS).
   * Awalan `NEXT_PUBLIC_` membuatnya tersedia di browser.
   *
   * @type {string}
   */
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  /**
   * Kunci "service_role" untuk proyek Supabase Anda.
   * **RAHASIA & SANGAT SENSITIF.** Kunci ini memiliki hak akses penuh ke database Anda
   * dan dapat melewati semua kebijakan Row Level Security (RLS).
   * **JANGAN PERNAH** mengekspos kunci ini di sisi klien atau di-commit ke Git.
   * Variabel ini hanya boleh digunakan di lingkungan server (misalnya, Server Actions, Route Handlers).
   *
   * @type {string}
   */
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};
