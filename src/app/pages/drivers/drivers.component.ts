import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';



@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  teams: Team[] = [];

  constructor(private firestoreService: FirestoreDataService) {}

  ngOnInit(): void {
    this.firestoreService.getDrivers().subscribe(drivers => this.drivers = drivers);
    this.firestoreService.getTeams().subscribe(teams => this.teams = teams);
  }

  getFullName(driver: Driver): string {
    return `${driver.name.firstname} ${driver.name.lastname}`;
  }

  getTeamName(teamId: string): string {
    return this.teams.find(t => t.teamID === teamId)?.name || 'unknown';
  }
}
