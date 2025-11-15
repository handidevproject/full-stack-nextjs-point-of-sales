import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

eslintConfig.push({
  /**
   * Aturan ESLint kustom.
   *
   * Di sini Anda dapat menimpa atau menambahkan aturan ESLint.
   * Aturan yang ada di bawah ini saat ini dinonaktifkan ("off").
   * Sebaiknya aktifkan kembali aturan-aturan ini di masa mendatang untuk kualitas kode yang lebih baik.
   */
  rules: {
    /**
     * Menonaktifkan aturan `exhaustive-deps` untuk React hooks.
     * Aturan ini biasanya memastikan bahwa semua variabel yang digunakan di dalam `useEffect`, `useCallback`, dll.,
     * disertakan dalam array dependensi. Menonaktifkannya dapat menyebabkan bug terkait state yang usang.
     * Sebaiknya hanya dinonaktifkan jika Anda yakin dengan apa yang Anda lakukan.
     *
     * @see https://github.com/facebook/react/issues/14920
     */
    "react-hooks/exhaustive-deps": "off",

    /**
     * Menonaktifkan aturan `jsx-key`.
     * Aturan ini mengharuskan setiap elemen dalam sebuah array atau iterator memiliki prop `key` yang unik.
     * Menonaktifkan ini dapat menyebabkan masalah rendering di React.
     * Sebaiknya hanya dinonaktifkan sementara selama pengembangan jika diperlukan.
     *
     * @see https://reactjs.org/docs/lists-and-keys.html
     */
    "react/jsx-key": "off",

    /**
     * Menonaktifkan aturan `no-explicit-any` dari TypeScript ESLint.
     * Aturan ini melarang penggunaan tipe `any`. Menggunakan `any` menghilangkan keuntungan dari pemeriksaan tipe statis.
     * Menonaktifkan aturan ini dapat berguna saat migrasi dari JavaScript ke TypeScript atau saat berhadapan dengan
     * library pihak ketiga yang tidak memiliki tipe yang baik.
     *
     * @see https://typescript-eslint.io/rules/no-explicit-any/
     */
    "@typescript-eslint/no-explicit-any": "off",

    /**
     * Menonaktifkan aturan `no-unused-vars` dari TypeScript ESLint.
     * Aturan ini akan memberikan peringatan jika ada variabel yang dideklarasikan tetapi tidak pernah digunakan.
     * Berguna untuk menjaga kebersihan kode. Menonaktifkannya mungkin berguna selama pengembangan
     * untuk menghindari peringatan saat mencoba berbagai hal.
     *
     * @see https://typescript-eslint.io/rules/no-unused-vars/
     */
    "@typescript-eslint/no-unused-vars": "off",
  },
});

export default eslintConfig;
