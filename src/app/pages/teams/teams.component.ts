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
  selector: 'app-teams',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;

  constructor() {}

  ngOnInit(): void {}

  getFullName(driver: Driver): string {
    return `${driver.name.firstname} ${driver.name.lastname}`;
  }

  getDriver(driverID: string): string {
    const driver = this.drivers.find(d => d.driverID === driverID);
    return driver ? this.getFullName(driver) : 'unknown';
  }
}
