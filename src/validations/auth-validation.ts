/**
 * @file Mendefinisikan skema validasi untuk data terkait otentikasi menggunakan Zod.
 * Skema ini memastikan bahwa data yang masuk ke server memiliki format yang benar.
 *
 * @see https://zod.dev/
 */

import z from "zod";

/**
 * Skema validasi untuk form login.
 *
 * Aturan:
 * - `email`: Harus berupa string, tidak boleh kosong, dan harus dalam format email yang valid.
 * - `password`: Harus berupa string dan tidak boleh kosong.
 */
export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

/**
 * Tipe data TypeScript yang diekstrak dari `loginSchemaForm`.
 * Ini memungkinkan kita untuk menggunakan tipe yang sama di sisi klien dan server,
 * memastikan konsistensi data di seluruh aplikasi.
 *
 * @example
 * const data: LoginForm = { email: 'user@example.com', password: 'password123' };
 */
export type LoginForm = z.infer<typeof loginSchemaForm>;
