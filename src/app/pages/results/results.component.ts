import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RaceResults, Result } from '../../shared/models/RaceResult';
import { Driver } from '../../shared/models/Driver';
import { Track } from '../../shared/models/Track';
import resultsData from '../../../../public/data/raceResults.json';
import driversData from '../../../../public/data/drivers.json';
import tracksData from '../../../../public/data/tracks.json';

@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class RaceResultsComponent implements OnInit {
  trackID: string | null = null;
  raceResults: Result[] = [];
  track: Track | null = null;
  drivers: Driver[] = driversData;
  displayedColumns: string[] = ['position', 'driver', 'time', 'points', 'fastestLap'];
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.trackID = this.route.snapshot.paramMap.get('id');
    if (this.trackID) {
      this.loadRaceResults();
      this.loadTrackDetails();
    }
  }

  private loadRaceResults(): void {
    if (!this.trackID) return;
    
    const raceData = (resultsData as RaceResults[]).find(result => result.trackID === this.trackID);
    if (raceData) {
      this.raceResults = raceData.results;
    }
  }

  private loadTrackDetails(): void {
    if (!this.trackID) return;
    
    const trackData = tracksData.find(track => track.trackID === this.trackID);
    if (trackData) {
        this.track = {
            ...trackData,
            date: new Date(trackData.date)
        } as Track;
    }
}

  getDriverName(driverId: string): string {
    const driver = this.drivers.find(d => d.driverID === driverId);
    return driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown Driver';
  }

  getDriverCountry(driverId: string): string {
    const driver = this.drivers.find(d => d.driverID === driverId);
    return driver ? driver.country : '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  }
}