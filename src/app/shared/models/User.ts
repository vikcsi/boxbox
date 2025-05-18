export interface User {
    userID: string;
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    favDriverID : string;
    favTeamID: string;
  }