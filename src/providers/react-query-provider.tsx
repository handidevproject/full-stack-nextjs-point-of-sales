'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

/**
 * Komponen provider untuk mengintegrasikan React Query ke dalam aplikasi.
 * Komponen ini membungkus seluruh aplikasi atau bagian yang memerlukan state management dari React Query.
 *
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Komponen anak yang akan dibungkus oleh provider.
 * @returns {JSX.Element} Provider React Query yang siap digunakan.
 */
export default function ReactQueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Membuat instance baru dari QueryClient dengan beberapa opsi default.
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                // Menonaktifkan refetch data otomatis saat window kembali fokus.
                // Berguna untuk mencegah request berlebihan yang tidak perlu.
                refetchOnWindowFocus: false,

                // Menonaktifkan refetch data otomatis saat koneksi internet kembali tersambung.
                refetchOnReconnect: false,

                // Menonaktifkan refetch data otomatis saat komponen pertama kali di-mount.
                // Data hanya akan di-fetch saat query dipanggil secara manual atau saat invalidasi.
                refetchOnMount: false,

                // Menonaktifkan percobaan ulang (retry) secara otomatis jika query gagal.
                retry: false,
            },
        },
    });

    // Membungkus komponen anak dengan QueryClientProvider agar dapat mengakses instance client.
    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}
