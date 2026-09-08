import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longTextPipe',
  pure:true
})
export class LongTextPipe implements PipeTransform {

  private maxLength:number = 60;

  transform(value: string , ...args: unknown[]): unknown {

    if(args && typeof args[0] == "number"){
      this.maxLength = Number(args[0])
    }

    const posFix = value.length > this.maxLength ? "..." : ""
    return value.slice(0,this.maxLength) + posFix
  }
}
