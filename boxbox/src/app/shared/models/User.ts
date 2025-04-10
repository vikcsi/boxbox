import { Driver } from "./Driver";
import { Team } from "./Team";

export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
  }