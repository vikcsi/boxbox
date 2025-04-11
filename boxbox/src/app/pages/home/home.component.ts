import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { MatCardModule } from '@angular/material/card';
import { Track } from '../../shared/models/Track';
import { Driver } from '../../shared/models/Driver';
import { RaceResults, Result } from '../../shared/models/RaceResult';
import tracksData from '../../../../public/data/tracks.json';
import resultsData from '../../../../public/data/raceResults.json';
import driversData from '../../../../public/data/drivers.json';

interface LatestRaceResult {
  position: number;
  driverName: string;
  driverCountry: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CountdownComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  raceDates: Date[] = [];
  tracks: Track[] = [];
  drivers: Driver[] = driversData;
  latestResults: LatestRaceResult[] = [];
  latestRaceTrack: Track | null = null;
  
  @ViewChild('countdownRef') countdownRef!: CountdownComponent;

  dailyFact: string = '';
  
  private facts: string[] = [
    "The fastest ever speed in a race is 231.5 miles per hour.",
    "The sound of a Formula 1 car is around 130 decibels",
    "The tyres are specially designed to grip the track.",
    "The sleek design of the car helps to cut through the air faster.",
    "Driver's experience g-force!",
    "The pit crew have lightning fast moves!",
    "Formula 1 cars only use one tank of fuel per race.",
    "Each team has between 300 and 1,200 members.",
    "Drivers wear high-tech helmets.",
    "Formula 1 teams use wind tunnels to test their car designs!"
  ];

  ngOnInit(): void {
    this.setDailyFact();
    this.loadTracks();
    this.findLatestRaceResults();
  }

  private loadTracks(): void {
    this.tracks = tracksData.map(track => {
      return {
        ...track,
        date: new Date(this.formatDate(track.date))
      } as unknown as Track;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (let index = 0; index < this.tracks.length; index++) {
      this.raceDates[index] = this.tracks[index].date;
    }
  }

  private findLatestRaceResults(): void {
    const today = new Date();
    const completedRaces = this.tracks.filter(track => track.date < today);
    
    if (completedRaces.length > 0) {
      const latestRace = completedRaces[completedRaces.length - 1];
      this.latestRaceTrack = latestRace;
      
      const raceResults = (resultsData as RaceResults[]).find(result => 
        result.trackID === latestRace.trackID
      );
      
      if (raceResults) {
        const top5Results = raceResults.results
          .filter(result => result.position <= 5)
          .sort((a, b) => a.position - b.position);
          
        this.latestResults = top5Results.map(result => {
          const driver = this.drivers.find(d => d.driverID === result.driverID);
          return {
            position: result.position,
            driverName: driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown Driver',
            driverCountry: driver?.country || '',
          };
        });
      }
    }
  }

  private formatDate(dateString: string): string {
    return dateString.replace(/(\d{4})\.(\d{2})\.(\d{2})\./, '$1-$2-$3');
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