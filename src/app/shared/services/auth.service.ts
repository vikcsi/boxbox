import { Injectable, NgZone } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  deleteUser
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  deleteDoc
} from '@angular/fire/firestore';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = new BehaviorSubject<FirebaseUser | null>(null);
  currentUser = this._currentUser.asObservable();
  
  private _userProfile = new BehaviorSubject<User | null>(null);
  userProfile = this._userProfile.asObservable();
  
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private auth: Auth, 
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone 
  ) {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      this.ngZone.run(() => {
        this._currentUser.next(firebaseUser);
        
        if (firebaseUser) {
          this.getUserProfile(firebaseUser.uid)
            .then(profile => {
              this._userProfile.next(profile);
            })
            .catch(error => {
              console.error('Error fetching user profile:', error);
            });
        } else {
          this._userProfile.next(null);
        }
      });
    });
  }


  async signUp(email: string, password: string, userData: Partial<User>): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      const userProfile: User = {
        userID: uid,
        email: email,
        name: userData.name || { firstname: '', lastname: '' },
        favDriverID: userData.favDriverID || '',
        favTeamID: userData.favTeamID || ''
      };
      
      await this.saveUserProfile(uid, userProfile);
      
      this.ngZone.run(() => {
        this._userProfile.next(userProfile);
        this.router.navigateByUrl('/home');
      });
    } catch (error) {
      throw error;
    }
  }

 
  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      const profile = await this.getUserProfile(uid);
      
      this.ngZone.run(() => {
        if (profile) {
          this._userProfile.next(profile);
        } else {
          console.error('User profile not found after sign in');
        }
        
        this.router.navigateByUrl('/home');
      });
    } catch (error) {
      throw error;
    }
  }

  
  async signOut(): Promise<void> {
    try {
      this.ngZone.run(() => {
        this._userProfile.next(null);
      });
      
      await signOut(this.auth);
      
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

 
  isLoggedIn(): boolean {
    return !!this._currentUser.value;
  }

 
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this._currentUser.value;
  }

  getCurrentUserProfile(): User | null {
    return this._userProfile.value;
  }

  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userRef = doc(this.firestore, `${this.USERS_COLLECTION}/${uid}`);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        return { ...data, userID: uid } as User;
      }
      
      const oldUserRef = doc(this.firestore, `users/${uid}`);
      const oldSnapshot = await getDoc(oldUserRef);
      
      if (oldSnapshot.exists()) {
        const oldData = oldSnapshot.data() as User;
        await this.saveUserProfile(uid, oldData);
        return { ...oldData, userID: uid } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return Promise.reject(error);
    }
  }

  
  async saveUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      const userRef = doc(this.firestore, `${this.USERS_COLLECTION}/${uid}`);
      return setDoc(userRef, cleanedData, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      return Promise.reject(error);
    }
  }

  
  async updateUserProfile(data: Partial<User>): Promise<void> {
    const user = this.getCurrentFirebaseUser();
    if (!user) throw new Error('No authenticated user');
    
    const currentProfile = this._userProfile.value;
    if (!currentProfile) throw new Error('No user profile');
    
    const updatedProfile = { ...currentProfile, ...data };
    
    await this.saveUserProfile(user.uid, updatedProfile);
    
    this.ngZone.run(() => {
      this._userProfile.next(updatedProfile);
    });
  }

  async deleteUserAccount(): Promise<void> {
    const firebaseUser = this.getCurrentFirebaseUser();
    if (!firebaseUser) {
      throw new Error('No authenticated user found');
    }

    const uid = firebaseUser.uid;

    try {
      const userRef = doc(this.firestore, `${this.USERS_COLLECTION}/${uid}`);
      await deleteDoc(userRef);

      try {
        const oldUserRef = doc(this.firestore, `users/${uid}`);
        const oldSnapshot = await getDoc(oldUserRef);
        if (oldSnapshot.exists()) {
          await deleteDoc(oldUserRef);
        }
      } catch (error) {
        console.error('Error deleting from old collection:', error);
      }
      
      await deleteUser(firebaseUser);
      
      this.ngZone.run(() => {
        this._userProfile.next(null);
        this.router.navigateByUrl('/login');
      });
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
}