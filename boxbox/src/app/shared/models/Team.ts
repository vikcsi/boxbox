import { Driver } from "./Driver";

export interface Team {
    teamID : number;
    name: string;
    base: string;
    principal: string;
    driver1: Driver;
    driver2: Driver;
}