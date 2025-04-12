import { Injectable } from '@angular/core';
import { Driver } from '../shared/models/Driver';
import { Team } from '../shared/models/Team';
import driversData from '../../../public/data/drivers.json';
import teamsData from '../../../public/data/teams.json';


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private drivers: Driver[] = driversData;
  private teams: Team[] = teamsData;

  constructor() { }

  getDriverById(driverID: string): Driver | undefined {
    return this.drivers.find(d => d.driverID === driverID);
  }

  getTeamById(teamID: string): Team | undefined {
    return this.teams.find(t => t.teamID === teamID);
  }

  getFullName(driverID: string): string {
    const driver = this.getDriverById(driverID);
    return driver ? `${driver.name.firstname} ${driver.name.lastname}` : 'Unknown Driver';
  }

  getAllDrivers(): Driver[] {
    return this.drivers;
  }

  getAllTeams(): Team[] {
    return this.teams;
  }
}