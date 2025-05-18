import { Injectable, NgZone } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  collection 
} from '@angular/fire/firestore';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = new BehaviorSubject<FirebaseUser | null>(null);
  currentUser = this._currentUser.asObservable();
  
  private _userProfile = new BehaviorSubject<User | null>(null);
  userProfile = this._userProfile.asObservable();
  
  // Átállítva a helyes "Users" kollekcióra
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private auth: Auth, 
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone // NgZone hozzáadva a Zone probléma kezeléséhez
  ) {
    // Listen for authentication state changes within zone
    onAuthStateChanged(this.auth, (firebaseUser) => {
      // NgZone-on belül futtatjuk a változtatásokat, hogy az Angular change detection működjön
      this.ngZone.run(() => {
        this._currentUser.next(firebaseUser);
        
        if (firebaseUser) {
          // User is signed in, fetch their profile
          this.getUserProfile(firebaseUser.uid)
            .then(profile => {
              this._userProfile.next(profile);
            })
            .catch(error => {
              console.error('Error fetching user profile:', error);
            });
        } else {
          // User is signed out
          this._userProfile.next(null);
        }
      });
    });
  }

  /**
   * Create a new user account and save profile data
   */
  async signUp(email: string, password: string, userData: Partial<User>): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user profile with UID
      const userProfile: User = {
        userID: uid,
        email: email,
        name: userData.name || { firstname: '', lastname: '' },
        favDriverID: userData.favDriverID || '',
        favTeamID: userData.favTeamID || ''
      };
      
      // Save user profile to Firestore
      await this.saveUserProfile(uid, userProfile);
      
      // NgZone-on belül frissítjük a state-et
      this.ngZone.run(() => {
        this._userProfile.next(userProfile);
        // Navigate to home after successful signup
        this.router.navigateByUrl('/home');
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      // Azonnal lekérjük a felhasználói profilt bejelentkezéskor
      const profile = await this.getUserProfile(uid);
      
      // NgZone-on belül frissítjük a state-et és navigálunk
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

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Előbb töröljük a lokális state-et
      this.ngZone.run(() => {
        this._userProfile.next(null);
      });
      
      // Majd kijelentkezünk a Firebase-ből
      await signOut(this.auth);
      
      // NgZone-on belül navigálunk
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if user is currently logged in
   */
  isLoggedIn(): boolean {
    return !!this._currentUser.value;
  }

  /**
   * Get the current Firebase user
   */
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this._currentUser.value;
  }

  /**
   * Get the current user profile
   */
  getCurrentUserProfile(): User | null {
    return this._userProfile.value;
  }

  /**
   * Fetch user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      // Először az új kollekcióból próbáljuk meg betölteni
      const userRef = doc(this.firestore, `${this.USERS_COLLECTION}/${uid}`);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        return { ...data, userID: uid } as User;
      }
      
      // Ha nem található, próbáljuk meg a régi kollekcióból
      const oldUserRef = doc(this.firestore, `users/${uid}`);
      const oldSnapshot = await getDoc(oldUserRef);
      
      if (oldSnapshot.exists()) {
        const oldData = oldSnapshot.data() as User;
        // Másoljuk át az adatokat az új kollekcióba
        await this.saveUserProfile(uid, oldData);
        return { ...oldData, userID: uid } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Save or update user profile to Firestore
   */
  async saveUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
      // Tisztított adatok, undefined értékek nélkül
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

  /**
   * Update the user profile
   */
  async updateUserProfile(data: Partial<User>): Promise<void> {
    const user = this.getCurrentFirebaseUser();
    if (!user) throw new Error('No authenticated user');
    
    const currentProfile = this._userProfile.value;
    if (!currentProfile) throw new Error('No user profile');
    
    const updatedProfile = { ...currentProfile, ...data };
    
    await this.saveUserProfile(user.uid, updatedProfile);
    
    // NgZone-on belül frissítjük a state-et
    this.ngZone.run(() => {
      this._userProfile.next(updatedProfile);
    });
  }
}