'use server';

import { createClient } from '@/lib/supabase/server';
import { AuthFormState } from '@/types/auth';
import { createUserSchema } from '@/validations/auth-validation';

/**
 * Server Action untuk membuat pengguna baru.
 * Fungsi ini menangani validasi data form, pendaftaran pengguna di Supabase Auth,
 * dan penyimpanan data tambahan seperti nama dan peran.
 *
 * @param {AuthFormState} prevState - State sebelumnya dari form, digunakan oleh `useFormState` untuk menampilkan error.
 * @param {FormData} formData - Data yang dikirim dari form, berisi email, password, nama, dan peran.
 * @returns {Promise<AuthFormState>} Objek state form yang baru.
 * - Jika berhasil, mengembalikan `{ status: 'success' }`.
 * - Jika validasi gagal, mengembalikan `{ status: 'error', errors: { ... } }` dengan detail error per field.
 * - Jika pendaftaran Supabase gagal, mengembalikan `{ status: 'error', errors: { _form: [errorMessage] } }`.
 */
export async function createUser(
    prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    // 1. Validasi data dari form menggunakan skema Zod.
    const validatedFields = createUserSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
        role: formData.get('role'),
        // avatar_url: formData.get('avatar_url'),
    });

    // 2. Jika validasi gagal, kembalikan pesan error yang terstruktur.
    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
                _form: [], // Error umum untuk form
            },
        };
    }

    // 3. Buat instance Supabase client untuk server-side.
    const supabase = await createClient();

    // 4. Lakukan pendaftaran pengguna baru (sign up) di Supabase.
    const { error } = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        options: {
            // Kirim data tambahan yang akan disimpan di tabel `users` (metadata).
            data: {
                name: validatedFields.data.name,
                role: validatedFields.data.role,
                // avatar_url: validatedFields.data.avatar_url,
            },
        },
    });

    // 5. Jika terjadi error saat pendaftaran, kembalikan pesan error.
    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message], // Menambahkan error ke pesan form umum.
            },
        };
    }

    // 6. Jika berhasil, kembalikan status sukses.
    return {
        status: 'success',
        errors: {}, // Kosongkan error jika sukses
    };
}
