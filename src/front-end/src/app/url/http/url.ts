import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class UrlHttp {

    private http = inject(HttpClient);

    saveTargetUrl(targetUrl:string){
        return this.http.post("http://localhost:3000/api/shortUrl",{
            targetUrl
        })
    }
}
