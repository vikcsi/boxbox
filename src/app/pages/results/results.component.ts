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
import { AddResultComponent } from '../add-result/add-result.component';

@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, AddResultComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  trackId: string = '';
  
  track: Track | null = null;
  drivers: Driver[] = [];
  raceResults: Result[] = [];
  
  displayedColumns: string[] = ['position', 'driver', 'time', 'points', 'fastestLap'];
  
  showAddResultForm = false;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (!paramId) return;
      
      this.trackId = paramId;
      
      this.loadData();
    });
  }

  loadData(): void {
    this.firestoreService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
      console.log('Betöltött pilóták:', drivers);
    });
    
    this.firestoreService.getTracks().subscribe(tracks => {
      const track = tracks.find(t => t.trackID === this.trackId);
      console.log('Talált pálya:', track);
      if (track) {
        this.track = { ...track, date: new Date(track.date) };
      }
    });
    
    console.log('Eredmények lekérése trackId:', this.trackId);
    this.firestoreService.getResults(this.trackId).subscribe(
      results => {
        console.log('Betöltött eredmények:', results);
        this.raceResults = results;
      },
      error => {
        console.error('Hiba az eredmények betöltésekor:', error);
      }
    );
  }
  
  onResultAdded(results: Result[]): void {
    this.raceResults = results;
    this.showAddResultForm = false;
    
    this.loadData();
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
  
  addNewResults(): void {
    this.showAddResultForm = true;
  }
}