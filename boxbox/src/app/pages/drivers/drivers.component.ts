import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import driversData from '../../../../public/data/drivers.json';
import teamsData from '../../../../public/data/teams.json';


@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;
  
  constructor() {}

  ngOnInit(): void {}

  getFullName(driver: Driver): string {
    return `${driver.name.firstname} ${driver.name.lastname}`;
  }

  getTeamName(teamId: string): string {
    const team = this.teams.find(t => t.teamID === teamId);
    return team ? team.name : 'unknown';
  }
}