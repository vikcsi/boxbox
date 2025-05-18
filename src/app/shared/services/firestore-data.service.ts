import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, docData, doc } from '@angular/fire/firestore';
import { Driver } from '../models/Driver';
import { Team } from '../models/Team';
import { Track } from '../models/Track';
import { RaceResults } from '../models/RaceResult';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreDataService {
  constructor(private firestore: Firestore) {}

  getDrivers(): Observable<Driver[]> {
    const driversRef = collection(this.firestore, 'Drivers');
    return collectionData(driversRef, { idField: 'driverID' }) as Observable<Driver[]>;
  }

  getTeams(): Observable<Team[]> {
    const teamsRef = collection(this.firestore, 'Teams');
    return collectionData(teamsRef, { idField: 'teamID' }) as Observable<Team[]>;
  }

  getTracks(): Observable<Track[]> {
    const tracksRef = collection(this.firestore, 'Tracks');
    return collectionData(tracksRef, { idField: 'trackID' }) as Observable<Track[]>;
  }

  getRaceResults(): Observable<RaceResults[]> {
    const resultsRef = collection(this.firestore, 'raceResults');
    return collectionData(resultsRef, { idField: 'id' }) as Observable<RaceResults[]>;
  }

  getRaceResultsByTrack(trackID: string): Observable<RaceResults | undefined> {
    const resultDoc = doc(this.firestore, `raceResults/${trackID}`);
    return docData(resultDoc) as Observable<RaceResults | undefined>;
  }
}
