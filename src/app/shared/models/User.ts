export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    favDriverID : string;
    favTeamID: string;
  }