import { create } from "zustand";

export interface UrlModel {
    url: string;
    shortCode: string;
    createdAt: Date;
    count: number;
}

export interface UrlListStore {
    urls: UrlModel[];
    addUrl: (url: UrlModel) => void;
    removeUrl: (url: UrlModel) => void;
}

export const useUrlListStore = create<UrlListStore>((set) => ({
    urls: [],

    addUrl: (url) => set((state) => ({ 
        urls: [...state.urls, url] 
    })),
    
    removeUrl: (url) => set((state) => ({ 
        urls: state.urls.filter((el) => el.shortCode !== url.shortCode) 
    })),
}));