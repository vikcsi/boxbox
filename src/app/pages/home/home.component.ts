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
import { StandingsService } from '../../services/standings.service';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';


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
export class HomeComponent implements OnInit {
  raceDates: Date[] = [];
  tracks: Track[] = [];
  drivers: Driver[] = driversData;
  latestResults: LatestRaceResult[] = [];
  latestRaceTrack: Track | null = null;
  isLoggedIn: boolean = false;
userFavorites: UserFavorites | null = null
  
constructor(
  private standingsService: StandingsService,
  private userService: UserService,
  private teamService: TeamService
) {}

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
    this.isLoggedIn = this.userService.isLoggedIn();
    this.setDailyFact();
    this.loadTracks();
    this.findLatestRaceResults();
    
    if (this.isLoggedIn) {
      this.loadUserFavorites();
    }
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


  private loadUserFavorites(): void {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    const driverStandings = this.standingsService.getDriverStandings();
    const teamStandings = this.standingsService.getTeamStandings();

    const favDriver = driverStandings.find(d => d.driverID === user.favDriverID);
    const favTeam = teamStandings.find(t => t.teamID === user.favTeamID);

    if (favDriver && favTeam) {
      this.userFavorites = {
        driverName: favDriver.name,
        driverPosition: driverStandings.indexOf(favDriver) + 1,
        driverPoints: favDriver.points,
        teamName: favTeam.name,
        teamPosition: teamStandings.indexOf(favTeam) + 1,
        teamPoints: favTeam.points
      };
    }
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

imageHeight = 300; 

ngAfterViewInit() {
  this.calculateImageHeight();
  window.addEventListener('resize', () => this.calculateImageHeight());
}

calculateImageHeight() {
  const imgElement = document.querySelector('.image-content img');
  if (imgElement) {
    this.imageHeight = imgElement.clientWidth * 0.75;
  }
}
}