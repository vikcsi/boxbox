import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { RaceResults, Result } from '../../shared/models/RaceResult';
import { StandingsService } from '../../services/standings.service';
import { Driver, DriverStanding } from '../../shared/models/Driver';
import { Team, TeamStanding } from '../../shared/models/Team';
import resultsData from '../../../../public/data/raceResults.json';
import driversData from '../../../../public/data/drivers.json';
import teamsData from '../../../../public/data/teams.json';

export enum Champs {
  null,
  Driver,
  Constructor
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

  constructor(private standingsService: StandingsService) {}

  
  driverStandings: DriverStanding[] = [];
  teamStandings: TeamStanding[] = [];
  
  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;
  results: RaceResults[] = resultsData as RaceResults[];
  
  driverDisplayedColumns: string[] = ['position', 'driver', 'team', 'points', 'wins'];
  teamDisplayedColumns: string[] = ['position', 'team', 'points', 'wins'];
  
  ngOnInit(): void {
    this.driverStandings = this.standingsService.getDriverStandings();
    this.teamStandings = this.standingsService.getTeamStandings();
  }
  
  onChange($event: { value: Champs; }) {
    this.selectedState = $event.value;
  }
  
}