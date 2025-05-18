import { FirestoreDataConverter } from '@angular/fire/firestore';
import { Result } from './RaceResult';


export const resultConverter: FirestoreDataConverter<Result> = {
  toFirestore: (r) => r,
  fromFirestore: (snap) => snap.data() as Result,
};
