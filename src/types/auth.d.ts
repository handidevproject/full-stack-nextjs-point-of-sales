/**
 * @file Mendefinisikan tipe data untuk state form otentikasi.
 */

/**
 * Mewakili state dari sebuah form otentikasi (login, register, dll.).
 * Tipe ini digunakan oleh hook `useFormState` untuk mengelola status
 * dan pesan kesalahan dari Server Actions.
 */
export type AuthFormState = {

  status?: string;
  /**
   * Pesan yang menjelaskan hasil operasi, seperti "Login berhasil" atau "Email sudah terdaftar".
   */
  message?: string;
  /**
   * Objek yang berisi pesan-pesan kesalahan validasi untuk setiap field form.
   * Kunci objek adalah nama field (misalnya, `email`, `password`).
   * Nilainya adalah array string yang berisi pesan kesalahan untuk field tersebut.
   */
  errors?: {
    email?: string[] ;
    password?: string[];
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    /**
     * Digunakan untuk menampung pesan kesalahan umum yang tidak terkait
     * dengan field spesifik, misalnya "Email atau password salah".
     */
    _form?: string[];
  };
};
