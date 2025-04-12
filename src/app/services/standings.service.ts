import { Injectable } from '@angular/core';
import { RaceResults } from '../shared/models/RaceResult';
import { Driver, DriverStanding } from '../shared/models/Driver';
import { Team, TeamStanding } from '../shared/models/Team';
import driversData from '../../../public/data/drivers.json';
import teamsData from '../../../public/data/teams.json';
import resultsData from '../../../public/data/raceResults.json';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private drivers: Driver[] = driversData;
  private teams: Team[] = teamsData;
  private results: RaceResults[] = resultsData as RaceResults[];

  constructor() { }

  getDriverStandings(): DriverStanding[] {
    const standings = this.drivers.map(driver => ({
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
        const driverStanding = standings.find(ds => ds.driverID === result.driverID);
        if (driverStanding) {
          driverStanding.points += result.points;
          if (result.position === 1) driverStanding.wins += 1;
          if (result.position <= 3) driverStanding.podiums += 1;
        }
      });
    });

    return standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
  }

  getTeamStandings(): TeamStanding[] {
    const standings = this.teams.map(team => ({
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
          const teamStanding = standings.find(ts => ts.teamID === driverTeamID);
          if (teamStanding) {
            teamStanding.points += result.points;
            if (result.position === 1) teamStanding.wins += 1;
          }
        }
      });
    });

    return standings.sort((a, b) => b.points - a.points || b.wins - a.wins);
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