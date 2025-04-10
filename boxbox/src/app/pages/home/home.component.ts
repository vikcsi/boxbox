import { Component, ViewChild, OnInit } from '@angular/core';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [CountdownComponent, MatCard],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  raceDates: Date[] = [
    new Date('2025-04-06T17:01:00'), 
    new Date('2025-06-06T17:00:00'),
    new Date('2025-07-01T15:45:00')
  ];
  
  @ViewChild('countdownRef') countdownRef!: CountdownComponent;

  dailyFact: string = '';
  
  private facts: string[] = [
    "The fastest ever speed in a race is 231.5 miles per hour.",
    "The sound of a Formula 1 car is around 130 decibels",
    "The tyres are specially designed to grip the track.",
    "The sleek design of the car helps to cut through the air faster.",
    "Driver’s experience g-force!",
    "The pit crew have lightning fast moves!",
    "Formula 1 cars only use one tank of fuel per race.",
    "Each team has between 300 and 1,200 members.",
    "Drivers wear high-tech helmets.",
    "Formula 1 teams use wind tunnels to test their car designs!"
  ];

  ngOnInit(): void {
    this.setDailyFact();
  }

  private setDailyFact(): void {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    const index = this.generateSeededRandomIndex(dateString, this.facts.length);
    
    this.dailyFact = this.facts[index];
  }

  private generateSeededRandomIndex(seed: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash; 
    }
    
    const positiveHash = Math.abs(hash);
    return positiveHash % max;
  }


}
