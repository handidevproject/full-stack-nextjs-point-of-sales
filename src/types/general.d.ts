/**
 * @file Mendefinisikan tipe-tipe data umum yang dapat digunakan di seluruh aplikasi.
 */

/**
 * Mewakili state dasar dari sebuah form yang ditangani oleh Server Action.
 *
 * @deprecated Sebaiknya gunakan tipe yang lebih spesifik seperti `AuthFormState`
 *             untuk kejelasan yang lebih baik. Tipe ini mungkin akan dihapus
 *             di masa mendatang untuk menghindari duplikasi.
 */
export type FormState = {
  /**
   * Status hasil operasi form, misalnya "error" atau "success".
   */
  status?: "error" | "success";

  /**
   * Pesan umum yang menjelaskan hasil operasi.
   */
  message?: string;

  /**
   * Objek untuk menampung pesan-pesan kesalahan.
   * Kunci `_form` digunakan untuk kesalahan yang tidak terikat pada field tertentu.
   */
  errors?: {
    [key: string]: string[] | undefined;
    _form?: string[];
  };
};

export type FormState = {
    errors?: {
        _form?: string[];
    };
    status?: string;
};

export type Preview = { file: File; displayUrl: string };

