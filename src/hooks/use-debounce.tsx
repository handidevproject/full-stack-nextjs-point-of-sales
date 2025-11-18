import { useRef } from 'react';

/**
 * Custom hook untuk membuat fungsi debounce.
 * Debounce menunda eksekusi sebuah fungsi hingga jeda waktu tertentu setelah pemanggilan terakhir.
 * Ini berguna untuk mengoptimalkan performa dengan mengurangi jumlah pemanggilan fungsi yang berlebihan,
 * misalnya pada input pencarian atau event window resize.
 *
 * @returns {(func: () => void, delay: number) => void} Sebuah fungsi yang menerima fungsi target dan jeda waktu (delay) sebagai argumen.
 */
export default function useDebounce() {
    // Menggunakan useRef untuk menyimpan ID dari setTimeout.
    // Ini memastikan bahwa ID timeout tetap ada di antara render tanpa memicu re-render.
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    /**
     * Fungsi debounce yang akan dieksekusi.
     * @param {() => void} func - Fungsi yang ingin dieksekusi setelah jeda waktu.
     * @param {number} delay - Jeda waktu dalam milidetik (ms) sebelum fungsi dieksekusi.
     */
    return (func: () => void, delay: number) => {
        // Jika sudah ada timeout yang berjalan, batalkan timeout tersebut.
        // Ini untuk mereset jeda waktu setiap kali fungsi dipanggil kembali.
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        // Atur timeout baru untuk mengeksekusi fungsi setelah jeda waktu yang ditentukan.
        debounceTimeout.current = setTimeout(() => {
            func();
            // Setelah fungsi dieksekusi, reset timeout ref menjadi null.
            debounceTimeout.current = null;
        }, delay);
    };
}
