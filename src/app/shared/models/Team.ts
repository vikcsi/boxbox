export interface Team {
    teamID : string;
    name: string;
    base: string;
    principal: string;
    driverIDs: string[];
}

export interface TeamStanding {
    teamID: string;
    name: string;
    points: number;
    wins: number;
  }