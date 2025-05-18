import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';

@Component({
  selector: 'app-teams',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  drivers: Driver[] = [];
  teams: Team[] = [];

  constructor(private firestoreService: FirestoreDataService) {}

  ngOnInit(): void {
    this.firestoreService.getDrivers().subscribe(drivers => this.drivers = drivers);
    this.firestoreService.getTeams().subscribe(teams => this.teams = teams);
  }

  getDriver(driverID: string): string {
    const driver = this.drivers.find(d => d.driverID === driverID);
    return driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown';
  }
}
