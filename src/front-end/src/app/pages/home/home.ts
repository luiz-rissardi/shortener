import { Component, inject } from '@angular/core';
import { Teste } from '../../teste/teste';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {

  private service = inject(Teste);

  protected click(){
    this.service.get()
      .subscribe({
        next(data){
          console.log("object:",data);
        },
        error(error){
          console.log("deu erro: ",error);
        }
      })
      
  }
}
