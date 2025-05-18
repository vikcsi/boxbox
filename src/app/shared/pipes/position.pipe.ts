import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'position' })
export class PositionPipe implements PipeTransform {
  transform(p: number): string {
    return p === 1 ? '🥇'
         : p === 2 ? '🥈'
         : p === 3 ? '🥉'
         : `${p}.`;
  }
}
