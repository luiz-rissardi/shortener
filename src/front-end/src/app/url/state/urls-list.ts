import { computed, Service, signal } from '@angular/core';

export interface UrlModel {
    shortCode: string
    targetUrl: string;
    createdAt: string,
    accessCount: number,

}

interface UrlListStateModel {
    urls: UrlModel[];
    load: boolean;
    error: string | null;
}


const initialState: UrlListStateModel = {
    urls: [],
    load: false,
    error: null,
};


@Service()
export class UrlsListState {

    private readonly state = signal<UrlListStateModel>(initialState);

    readonly urls = computed(() => this.state().urls.reverse());
    readonly load = computed(() => this.state().load);
    readonly error = computed(() => this.state().error);

    setUrls(urls: UrlModel[]): void {
        this.state.update((s) => ({
            ...s,
            urls,
            load: true
        }));
    }

    removeOne(shortCode: string) {
        this.state.update(state => {
            return {
                ...state,
                urls: state.urls.filter(el => el.shortCode !== shortCode)
            }
        })
    }

    addOne(urlModel: UrlModel) {
        this.state.update(state => {
            return {
                ...state,
                urls: [...state.urls, urlModel]
            }
        })
    }

    setError(message: string): void {
        this.state.update((s) => ({ ...s, error: message, load: false }));
    }

    reset(): void {
        this.state.set(initialState);
    }
}
