import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Track } from '../../shared/models/Track';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';

@Component({
  selector: 'app-tracks',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.scss'
})
export class TracksComponent implements OnInit {
  tracks: Track[] = [];

  constructor(private firestoreService: FirestoreDataService) {}

  ngOnInit(): void {
    this.firestoreService.getTracks().subscribe(tracks => {
      this.tracks = tracks.map(track => ({
        ...track,
        date: new Date(track.date)
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
    });
  }

  private formatDate(dateString: string): string {
    return dateString.replace(/(\d{4})\.(\d{2})\.(\d{2})\./, '$1-$2-$3');
  }

  isRaceCompleted(raceDate: Date): boolean {
    return raceDate < new Date();
  }

  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
