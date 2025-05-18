import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownFormatPipe } from '../pipes/countdown-format.pipe';
import { OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  standalone: true,
  imports: [CommonModule, CountdownFormatPipe],
})
export class CountdownComponent implements OnInit, OnDestroy, OnChanges {
  @Input() targetDates: Date[] = [];
  @Input() restartDelay: number = 10000;
  @Input() raceTimeMessage: string = "It's race time!";

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  isRaceTime: boolean = false;
  currentTargetIndex: number = 0;

  private intervalId?: number;

  constructor() {}

  ngOnInit(): void {
    if (this.targetDates?.length) {
      this.startCountdown();
    }  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['targetDates'] && this.targetDates?.length) {
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startCountdown(): void {
    this.clearTimer();
  
    const now = Date.now();
  
    while (
      this.currentTargetIndex < this.targetDates.length &&
      this.targetDates[this.currentTargetIndex].getTime() <= now
    ) {
      this.currentTargetIndex++;
    }
  
    if (this.currentTargetIndex >= this.targetDates.length) {
      this.isRaceTime = true;
      setTimeout(() => {
        this.currentTargetIndex = 0;
        this.isRaceTime = false;
        this.startCountdown();
      }, this.restartDelay);
      return;
    }
  
    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const currentTarget = this.targetDates[this.currentTargetIndex].getTime();
      const distance = currentTarget - now;
  
      if (distance > 0) {
        this.isRaceTime = false;
        this.calculateTimeUnits(distance);
      } else {
        this.isRaceTime = true;
        this.days = this.hours = this.minutes = this.seconds = 0;
        this.clearTimer();
  
        setTimeout(() => {
          this.currentTargetIndex++;
          this.isRaceTime = false;
          this.startCountdown();
        }, this.restartDelay);
      }
    }, 1000);
  }
  

  clearTimer(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  calculateTimeUnits(distance: number): void {
    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

  getFormattedCountdown(): string {
    const formatter = new CountdownFormatPipe();

    if (this.isRaceTime) {
      return this.raceTimeMessage;
    }

    return formatter.transform(this.days, 'days', false, true) + ' ' +
           formatter.transform(this.hours, 'hours', true, true) + ' ' +
           formatter.transform(this.minutes, 'minutes', true, true) + ' ' +
           formatter.transform(this.seconds, 'seconds', true, true);
  }
}
