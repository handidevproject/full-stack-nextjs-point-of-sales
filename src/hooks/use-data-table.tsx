import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/data-table-constant';
import { useState } from 'react';

/**
 * Custom hook untuk mengelola state paginasi pada data table.
 * Menyediakan state untuk halaman saat ini (`currentPage`) dan batas data per halaman (`currentLimit`),
 * serta fungsi untuk mengubahnya.
 *
 * @returns {object} Objek yang berisi state dan handler untuk paginasi.
 * @property {number} currentPage - Nomor halaman yang sedang aktif.
 * @property {(page: number) => void} handleChangePage - Fungsi untuk mengubah halaman saat ini.
 * @property {number} currentLimit - Jumlah data yang ditampilkan per halaman.
 * @property {(limit: number) => void} handleChangeLimit - Fungsi untuk mengubah batas data per halaman dan mereset ke halaman pertama.
 */
export default function useDataTable() {
    // State untuk menyimpan nomor halaman saat ini, diinisialisasi dengan nilai default.
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

    // State untuk menyimpan batas jumlah data per halaman, diinisialisasi dengan nilai default.
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);

    /**
     * Mengubah nilai halaman saat ini.
     * @param {number} page - Nomor halaman baru yang akan diatur.
     */
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    /**
     * Mengubah batas jumlah data per halaman dan mereset halaman kembali ke halaman pertama.
     * @param {number} limit - Batas baru jumlah data per halaman.
     */
    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit);
        // Setiap kali batas diubah, reset halaman ke halaman pertama untuk konsistensi.
        setCurrentPage(DEFAULT_PAGE);
    };

    return {
        currentPage,
        handleChangePage,
        currentLimit,
        handleChangeLimit,
    };
}
