import z from 'zod';

/**
 * Skema validasi untuk form login.
 * Memastikan bahwa email dan password diisi dengan format yang benar.
 *
 * @property {string} email - Email pengguna, harus berupa format email yang valid dan tidak boleh kosong.
 * @property {string} password - Password pengguna, tidak boleh kosong.
 */
export const loginSchemaForm = z.object({
    email: z
        .string()
        .min(1, { message: 'Email tidak boleh kosong' })
        .email({ message: 'Format email tidak valid' }),
    password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

/**
 * Skema validasi untuk form pembuatan pengguna baru.
 * Memastikan semua field yang diperlukan (email, password, nama, peran) diisi.
 *
 * @property {string} email - Email pengguna baru, harus valid dan tidak boleh kosong.
 * @property {string} password - Password untuk pengguna baru, tidak boleh kosong.
 * @property {string} name - Nama lengkap pengguna, tidak boleh kosong.
 * @property {string} role - Peran pengguna (misalnya, 'admin', 'cashier'), tidak boleh kosong.
 */
export const createUserSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    // Komentar untuk referensi: validasi untuk avatar_url bisa seperti ini
    avatar_url: z.union([
      z.string().min(1, 'Image URL is required'),
      z.instanceof(File),
    ]),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    avatar_url: z.union([
        z.string().min(1, 'Image URL is required'),
        z.instanceof(File),
    ]),
});

/**
 * Tipe data TypeScript yang diturunkan dari `loginSchemaForm`.
 * Berguna untuk type-safety saat mengakses data form login.
 *
 * @example
 * const data: LoginForm = { email: 'user@example.com', password: 'password123' };
 */
export type LoginForm = z.infer<typeof loginSchemaForm>;

/**
 * Tipe data TypeScript yang diturunkan dari `createUserSchema`.
 * Berguna untuk type-safety saat membuat pengguna baru.
 *
 * @example
 * const newUser: CreateUserForm = { email: 'new@example.com', password: 'newpassword', name: 'New User', role: 'cashier' };
 */




export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
