import { Component } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

export enum Champs {
  null,
  Driver,
  Constructor
}

@Component({
  selector: 'app-board',
  imports: [MatButtonToggle, MatButtonToggleGroup],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  toggleEnum = Champs;
  selectedState = Champs.null;
        
  onChange($event: { value: Champs; }) {
    console.log($event.value);
    this.selectedState = $event.value;
  }
}
