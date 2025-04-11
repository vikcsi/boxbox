export interface Result {
    position: number;
    driverID: string;
    time: string;
    points: number;
    fastestLap: boolean;
  }
  
  export interface RaceResults {
    trackID: string;
    date: string;
    results: Result[];
  }