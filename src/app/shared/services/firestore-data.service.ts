import { Injectable } from '@angular/core';
import {
  Firestore,
  collection, doc, collectionData, docData,
  addDoc, updateDoc, deleteDoc, getDoc, setDoc, arrayUnion,
  query, where, orderBy, limit,
  CollectionReference
} from '@angular/fire/firestore';
import { Driver } from '../models/Driver';
import { Team } from '../models/Team';
import { Track } from '../models/Track';
import { Result, RaceResults } from '../models/RaceResult';
import { resultConverter } from '../models/result.converter';
import { Observable, map } from 'rxjs';

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

  getResults(trackId: string): Observable<Result[]> {
    const resultsRef = collection(this.firestore, 'raceResults');
    
    return collectionData(resultsRef, { idField: 'id' }).pipe(
      map((allResults: any[]) => {
        const matchingDoc = allResults.find(doc => doc.trackID === trackId);
        console.log('Talált dokumentum:', matchingDoc);
        
        return matchingDoc?.results || [];
      })
    );
  }

  setRaceResults(trackId: string, results: Result[]): Promise<void> {
    const resultsRef = collection(this.firestore, 'raceResults');
    
    return new Promise((resolve, reject) => {
      collectionData(resultsRef, { idField: 'id' }).pipe(
        map((allResults: any[]) => allResults.find(doc => doc.trackID === trackId))
      ).subscribe(
        existingDoc => {
          if (existingDoc) {
            const docRef = doc(this.firestore, `raceResults/${existingDoc.id}`);
            updateDoc(docRef, { results }).then(resolve).catch(reject);
          } else {
            addDoc(resultsRef, { 
              trackID: trackId,
              results,
              date: new Date().toISOString()
            }).then(() => resolve()).catch(reject);
          }
        },
        error => reject(error)
      );
    });
  }
}
