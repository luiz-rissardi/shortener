import { computed, Service, signal } from '@angular/core';


export interface UrlStateModel {
    targetUrl: string;
    shortCode:string;
    load: boolean;
    error: string | null;
}

const initialState: UrlStateModel = {
    targetUrl: "",
    shortCode:"",
    load: false,
    error: null,
};

@Service()
export class UrlState {

    private readonly state = signal<UrlStateModel>(initialState);

    readonly targetUrl = computed(() => this.state().targetUrl);
    readonly load = computed(() => this.state().load);
    readonly shortCode = computed(() => this.state().shortCode);
    readonly error = computed(() => this.state().error);

    setShortCode(shortCode:string   ): void {
        this.state.update((s) => ({ ...s, shortCode, load: true }));
    }

    setTargetUrl(url: string): void {
        this.state.update((s) => ({
            ...s,
            targetUrl:url,
            load:true   
        }));
    }

    setError(message: string): void {
        this.state.update((s) => ({ ...s, error: message, load: false }));
    }

    reset(): void {
        this.state.set(initialState);
    }

}
