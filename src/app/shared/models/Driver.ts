export interface Driver {
  driverID : string;
    name: {
      firstname: string;
      lastname: string;
    };
    raceNumber: number;
    country: string;
    teamID: string;
  }

  export interface DriverStanding {
    driverID: string;
    name: string;
    country: string;
    team: string;
    points: number;
    wins: number;
    podiums: number;
  }