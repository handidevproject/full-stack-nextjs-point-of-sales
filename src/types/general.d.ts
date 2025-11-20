export type FormState = {
    errors?: {
        _form?: string[];
    };
    status?: string;
};

export const INITIAL_STATE_ACTION = {
    status: 'idle',
    errors: {
        _form: [],
    },
};

export type Preview = { file: File; displayUrl: string };

