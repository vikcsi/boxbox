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
import { FirestoreDataService } from '../../shared/services/firestore-data.service';

@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  trackID: string | null = null;
  raceResults: Result[] = [];
  track: Track | null = null;
  drivers: Driver[] = [];
  displayedColumns: string[] = ['position', 'driver', 'time', 'points', 'fastestLap'];

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreDataService
  ) {}

  ngOnInit(): void {
    this.trackID = this.route.snapshot.paramMap.get('id');
    if (!this.trackID) return;

    this.firestoreService.getDrivers().subscribe(drivers => this.drivers = drivers);
    this.firestoreService.getTracks().subscribe(tracks => {
      const match = tracks.find(t => t.trackID === this.trackID);
      if (match) {
        this.track = { ...match, date: new Date(match.date) };
      }
    });

    this.firestoreService.getRaceResults().subscribe(results => {
      const race = results.find(r => r.trackID === this.trackID);
      if (race) this.raceResults = race.results;
    });
  }

  getDriverName(driverId: string): string {
  const driver = this.drivers.find(d => d.driverID === driverId);
  return driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown';
}

getDriverCountry(driverId: string): string {
  return this.drivers.find(d => d.driverID === driverId)?.country || 'Unknown';
}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
