import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Track } from '../../shared/models/Track';
import tracksData from '../../../../public/data/tracks.json';

@Component({
  selector: 'app-tracks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.scss'
})
export class TracksComponent implements OnInit {
  tracks: Track[] = [];

  constructor() {}

  ngOnInit(): void {
    this.tracks = tracksData.map(track => {
      return {
        ...track,
        date: new Date(this.formatDate(track.date))
      } as unknown as Track;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private formatDate(dateString: string): string {
    return dateString.replace(/(\d{4})\.(\d{2})\.(\d{2})\./, '$1-$2-$3');
  }

  isRaceCompleted(raceDate: Date): boolean {
    const today = new Date();
    return raceDate < today;
  }

  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  }
}