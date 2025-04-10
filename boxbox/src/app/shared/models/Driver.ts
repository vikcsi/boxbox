import { Team } from "./Team";

export interface Driver {
  driverID : number;
    name: {
      firstname: string;
      lastname: string;
    };
    raceNumber: number;
    country: string;
    team: Team;
  }