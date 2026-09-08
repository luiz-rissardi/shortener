import { inject, Service } from '@angular/core';
import { UrlHttp } from '../http/url';
import { UrlState } from '../state/url-state';
import { UrlsListState } from '../state/urls-list';


@Service()
export class UrlFacade {

    private urlHttp = inject(UrlHttp);
    private urlState = inject(UrlState);
    private urlListState = inject(UrlsListState);

    createShortCode(targetUrl: string) {
        try {
            this.urlHttp.saveTargetUrl(targetUrl)
                .subscribe({
                    next: (value: any) => {
                        this.urlListState.addOne({
                            accessCount:0,
                            shortCode:value.shortCode,
                            targetUrl,
                            createdAt: new Date().toISOString()
                        })
                        this.urlState.setTargetUrl(targetUrl)
                        this.urlState.setShortCode(value.shortCode)
                    },
                    error: (err) => {
                        this.urlState.setError("Não foi possivel encurtar a url, tente novamente mais tarde")
                    }
                })
        } catch (error) {
            this.urlState.setError("Não foi possivel encurtar a url, tente novamente mais tarde")
        }
    }

    getAllUrls() {
        try {
            this.urlHttp.getAllUrls()
                .subscribe({
                    next: (value: any) => {
                        this.urlListState.setUrls(value)
                    },
                    error: (err) => {
                        this.urlListState.setError("não foi possivel pegar as urls")
                    }
                })
        } catch (error) {
            this.urlListState.setError("não foi possivel pegar as urls")
        }
    }

    deleteUrlModel(shortCode: string) {
        try {
            this.urlHttp.deleteUrl(shortCode)
                .subscribe()
        } catch (error) {
            console.log("não foi possivel deletar a url");
        }
    }
}
