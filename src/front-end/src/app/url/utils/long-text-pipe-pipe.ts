import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longTextPipe',
  pure:true
})
export class LongTextPipe implements PipeTransform {

  private maxLength = 60;

  transform(value: string , ...args: unknown[]): unknown {
    const posFix = value.length > this.maxLength ? "..." : ""
    return value.slice(0,this.maxLength) + posFix
  }
}
