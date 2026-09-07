import { inject, Service } from '@angular/core';
import { UrlHttp } from '../http/url';
import { UrlState } from '../state/url-state';


@Service()
export class UrlFacade {

    private urlHttp = inject(UrlHttp);
    private urlState = inject(UrlState)

    createShortCode(targetUrl: string) {
        try {
            this.urlHttp.saveTargetUrl(targetUrl)
                .subscribe({
                    next: (value: any) => {
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
}
