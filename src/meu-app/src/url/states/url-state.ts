import { create } from "zustand";

export interface UrlModelStore {
    url: string | null;
    shortCode: string | null;
    error: any;
    loaded: boolean;

    setUrl: (url: string | null) => void;
    setShortCode: (shortCode: string | null) => void;
    setError: (error: any) => void;
    reset: () => void;
}

export const useUrlStore = create<UrlModelStore>((set) => ({
    url: null,
    shortCode: null,
    error: null,
    loaded: false,

    setUrl: (url) => set(state => ({ ...state, url })),
    setShortCode: (shortCode) => set(state => ({ ...state, shortCode, loaded: true })),
    setError: (error) => set(state => ({...state, error, loaded: false })),
    reset: () => set({
        url: null,
        shortCode: null,
        error: null,
        loaded: false,
    }),
}));