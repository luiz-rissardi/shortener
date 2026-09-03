import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Teste {

    private http = inject(HttpClient);

    get(){
        return this.http.get("http://localhost:3000/test")
    }
}
