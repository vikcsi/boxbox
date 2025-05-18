import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';
import { Driver, DriverStanding } from '../../shared/models/Driver';
import { Team, TeamStanding } from '../../shared/models/Team';
import { RaceResults } from '../../shared/models/RaceResult';

export enum Champs {
  null,
  Driver,
  Constructor
}

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, MatButtonToggle, MatButtonToggleGroup, MatCardModule, MatTableModule, RouterModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.scss'
})
export class StandingsComponent implements OnInit {
  toggleEnum = Champs;
  selectedState = Champs.null;

  driverStandings: DriverStanding[] = [];
  teamStandings: TeamStanding[] = [];

  drivers: Driver[] = [];
  teams: Team[] = [];
  results: RaceResults[] = [];

  driverDisplayedColumns: string[] = ['position', 'driver', 'team', 'points', 'wins'];
  teamDisplayedColumns: string[] = ['position', 'team', 'points', 'wins'];

  constructor(private firestoreService: FirestoreDataService) {}

  ngOnInit(): void {
    this.firestoreService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
      this.computeStandings();
    });

    this.firestoreService.getTeams().subscribe(teams => {
      this.teams = teams;
      this.computeStandings();
    });

    this.firestoreService.getRaceResults().subscribe(results => {
      this.results = results;
      this.computeStandings();
    });
  }

  private computeStandings(): void {
    if (this.drivers.length === 0 || this.teams.length === 0 || this.results.length === 0) return;

    const driverMap: Record<string, DriverStanding> = {};
    const teamMap: Record<string, TeamStanding> = {};

    for (const result of this.results) {
      for (const entry of result.results) {
        // Driver standings
        if (!driverMap[entry.driverID]) {
          const driver = this.drivers.find(d => d.driverID === entry.driverID);
          if (!driver) continue;
          const team = this.teams.find(t => t.teamID === driver.teamID);
          driverMap[entry.driverID] = {
            driverID: driver.driverID,
            name: `${driver.name.firstname} ${driver.name.lastname}`,
            country: driver.country,
            team: team?.name || 'Unknown',
            points: 0,
            wins: 0,
            podiums: 0
          };
        }

        driverMap[entry.driverID].points += entry.points;
        if (entry.position === 1) driverMap[entry.driverID].wins++;
        if (entry.position >= 1 && entry.position <= 3) {
          driverMap[entry.driverID].podiums++;
        }

        // Team standings
        const driver = this.drivers.find(d => d.driverID === entry.driverID);
        if (driver) {
          const teamID = driver.teamID;
          if (!teamMap[teamID]) {
            const team = this.teams.find(t => t.teamID === teamID);
            if (!team) continue;
            teamMap[teamID] = {
              teamID: teamID,
              name: team.name,
              points: 0,
              wins: 0
            };
          }
          teamMap[teamID].points += entry.points;
          if (entry.position === 1) teamMap[teamID].wins++;
        }
      }
    }

    this.driverStandings = Object.values(driverMap).sort((a, b) => b.points - a.points);
    this.teamStandings = Object.values(teamMap).sort((a, b) => b.points - a.points);
  }

  onChange($event: { value: Champs }): void {
    this.selectedState = $event.value;
  }
}
