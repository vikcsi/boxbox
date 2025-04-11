import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { RaceResults, Result } from '../../shared/models/RaceResult';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import resultsData from '../../../../public/data/raceResults.json';
import driversData from '../../../../public/data/drivers.json';
import teamsData from '../../../../public/data/teams.json';

export enum Champs {
  null,
  Driver,
  Constructor
}

interface DriverStanding {
  driverID: string;
  name: string;
  country: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
}

interface TeamStanding {
  teamID: string;
  name: string;
  points: number;
  wins: number;
}

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggle, 
    MatButtonToggleGroup,
    MatCardModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.scss'
})
export class StandingsComponent implements OnInit {
  toggleEnum = Champs;
  selectedState = Champs.null;
  
  driverStandings: DriverStanding[] = [];
  teamStandings: TeamStanding[] = [];
  
  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;
  results: RaceResults[] = resultsData as RaceResults[];
  
  driverDisplayedColumns: string[] = ['position', 'driver', 'team', 'points', 'wins'];
  teamDisplayedColumns: string[] = ['position', 'team', 'points', 'wins'];
  
  ngOnInit(): void {
    this.calculateDriverStandings();
    this.calculateTeamStandings();
  }
  
  onChange($event: { value: Champs; }) {
    console.log($event.value);
    this.selectedState = $event.value;
  }
  
  private calculateDriverStandings(): void {
    this.driverStandings = this.drivers.map(driver => ({
      driverID: driver.driverID,
      name: `${driver.name.firstname} ${driver.name.lastname}`,
      country: driver.country,
      team: this.getTeamName(driver.teamID),
      points: 0,
      wins: 0,
      podiums: 0
    }));
    
    this.results.forEach(race => {
      race.results.forEach(result => {
        const driverStanding = this.driverStandings.find(ds => ds.driverID === result.driverID);
        if (driverStanding) {
          driverStanding.points += result.points;
          
          if (result.position === 1) {
            driverStanding.wins += 1;
          }
          
          if (result.position <= 3) {
            driverStanding.podiums += 1;
          }
        }
      });
    });
    
    this.driverStandings.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.wins - a.wins;
    });
  }
  
  private calculateTeamStandings(): void {
    this.teamStandings = this.teams.map(team => ({
      teamID: team.teamID,
      name: team.name,
      points: 0,
      wins: 0
    }));
    
    this.results.forEach(race => {
      const raceWinnerTeamID = this.getTeamIDByDriverID(
        race.results.find(r => r.position === 1)?.driverID || ''
      );
      
      race.results.forEach(result => {
        const driverTeamID = this.getTeamIDByDriverID(result.driverID);
        if (driverTeamID) {
          const teamStanding = this.teamStandings.find(ts => ts.teamID === driverTeamID);
          if (teamStanding) {
            teamStanding.points += result.points;
            
            if (result.position === 1) {
              teamStanding.wins += 1;
            }
          }
        }
      });
    });
    
    this.teamStandings.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.wins - a.wins;
    });
  }
  
  private getTeamName(teamID: string): string {
    const team = this.teams.find(t => t.teamID === teamID);
    return team ? team.name : 'Unknown Team';
  }
  
  private getTeamIDByDriverID(driverID: string): string | undefined {
    const driver = this.drivers.find(d => d.driverID === driverID);
    return driver?.teamID;
  }
}