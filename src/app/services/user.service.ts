import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;

  constructor() { }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) return null;
    
    return {
      name: {
        firstname: 'Test',
        lastname: 'User'
      },
      email: 'test@example.com',
      password: 'testpw',
      favDriverID: 'cl16', 
      favTeamID: 'ferr'     
    };
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    this.currentUser = null;
  }
}