/**
 * @file Menyimpan nilai-nilai konstan yang terkait dengan otentikasi.
 * Ini membantu menghindari "magic strings" dan menjaga konsistensi di seluruh aplikasi.
 */

/**
 * Nilai awal untuk field-field pada form login.
 * Digunakan untuk menginisialisasi state form.
 */
export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

/**
 * State awal untuk form login, digunakan oleh hook `useFormState`.
 * Ini mendefinisikan bentuk state sebelum interaksi pengguna terjadi.
 *
 * @type {AuthFormState}
 */
export const INITIAL_STATE_LOGIN_FORM = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: [],
    },
};


export const INITIAL_STATE_PROFILE = {
    id: '',
    name: '',
    role: '',
    avatar_url: '',
};
