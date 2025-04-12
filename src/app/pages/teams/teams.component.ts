import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { TeamService } from '../../services/team.service';
import driversData from '../../../../public/data/drivers.json';
import teamsData from '../../../../public/data/teams.json';

@Component({
  selector: 'app-teams',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {}

  getDriver(driverID: string): string {
    return this.teamService.getFullName(driverID);
  }
}
