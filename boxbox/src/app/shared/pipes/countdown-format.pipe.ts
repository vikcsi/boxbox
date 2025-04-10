import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdownFormat'
})
export class CountdownFormatPipe implements PipeTransform {

  transform(
    value: number, 
    type: 'days' | 'hours' | 'minutes' | 'seconds', 
    padZero: boolean = true, 
    showLabel: boolean = true
  ): string {
    const formattedValue = padZero ? value.toString().padStart(2, '0') : value.toString();
    
    if (!showLabel) {
      return formattedValue;
    }
    
    const labels = {
      days: value === 1 ? 'day' : 'days',
      hours: 'hours',
      minutes: 'min',
      seconds: 'sec'
    };
    
    return `${formattedValue} ${labels[type]}`;
  }
}