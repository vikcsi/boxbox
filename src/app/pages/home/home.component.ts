import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { MatCardModule } from '@angular/material/card';
import { Track } from '../../shared/models/Track';
import { Driver } from '../../shared/models/Driver';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

interface LatestRaceResult {
  position: number;
  driverName: string;
  driverCountry: string;
}

interface UserFavorites {
  driverName: string;
  driverPosition: number;
  driverPoints: number;
  teamName: string;
  teamPosition: number;
  teamPoints: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CountdownComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  raceDates: Date[] = [];
  tracks: Track[] = [];
  drivers: Driver[] = [];
  latestResults: LatestRaceResult[] = [];
  latestRaceTrack: Track | null = null;
  isLoggedIn: boolean = false;
  userFavorites: UserFavorites | null = null;
  private userProfileSubscription?: Subscription;

  constructor(
    private firestoreService: FirestoreDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.firestoreService.getTracks().subscribe(tracks => {
    this.tracks = tracks.map(track => ({
    ...track,
    date: track.date instanceof Date ? track.date : new Date(track.date)
  })).sort((a, b) => a.date.getTime() - b.date.getTime());

    this.raceDates = this.tracks.map(t => t.date);
    this.findLatestRaceResults();
});


    this.firestoreService.getDrivers().subscribe(drivers => this.drivers = drivers);

    this.userProfileSubscription = this.authService.userProfile.subscribe(profile => {
      this.isLoggedIn = !!profile;
      if (profile) this.loadUserFavorites(profile);
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  private findLatestRaceResults(): void {
    this.firestoreService.getRaceResults().subscribe(results => {
      const today = new Date();
      const completed = this.tracks.filter(track => track.date < today);
      if (completed.length === 0) return;

      const latest = completed[completed.length - 1];
      this.latestRaceTrack = latest;

      const race = results.find(r => r.trackID === latest.trackID);
      if (race) {
        this.latestResults = race.results
          .filter(r => r.position <= 5)
          .sort((a, b) => a.position - b.position)
          .map(r => {
            const driver = this.drivers.find(d => d.driverID === r.driverID);
            return {
              position: r.position,
              driverName: driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown',
              driverCountry: driver?.country || ''
            };
          });
      }
    });
  }


  private loadUserFavorites(user: any): void {
  if (!user.favDriverID || !user.favTeamID) return;

  this.firestoreService.getDrivers().subscribe(drivers => {
    this.firestoreService.getTeams().subscribe(teams => {
      this.firestoreService.getRaceResults().subscribe(results => {
        const driverMap = new Map<string, number>();
        const teamMap = new Map<string, number>();
        const driverPoints: Record<string, number> = {};
        const teamPoints: Record<string, number> = {};

        results.forEach(race => {
          race.results.forEach(result => {
            driverPoints[result.driverID] = (driverPoints[result.driverID] || 0) + result.points;
            const driver = drivers.find(d => d.driverID === result.driverID);
            if (driver) {
              teamPoints[driver.teamID] = (teamPoints[driver.teamID] || 0) + result.points;
            }
          });
        });

        const sortedDrivers = [...drivers].sort((a, b) => (driverPoints[b.driverID] || 0) - (driverPoints[a.driverID] || 0));
        const sortedTeams = [...teams].sort((a, b) => (teamPoints[b.teamID] || 0) - (teamPoints[a.teamID] || 0));

        const favDriver = sortedDrivers.find(d => d.driverID === user.favDriverID);
        const favTeam = sortedTeams.find(t => t.teamID === user.favTeamID);

        if (favDriver && favTeam) {
          this.userFavorites = {
            driverName: `${favDriver.name.firstname} ${favDriver.name.lastname}`,
            driverPosition: sortedDrivers.indexOf(favDriver) + 1,
            driverPoints: driverPoints[favDriver.driverID] || 0,
            teamName: favTeam.name,
            teamPosition: sortedTeams.indexOf(favTeam) + 1,
            teamPoints: teamPoints[favTeam.teamID] || 0
          };
        }
      });
    });
  });
}


  getPositionColor(position: number): string {
    const colors = {
      1: '#FFD700',
      2: '#C0C0C0',
      3: '#CD7F32',
      4: '#8d0000',
      5: '#8d0000'
    };
    return colors[position as keyof typeof colors];
  }
}
