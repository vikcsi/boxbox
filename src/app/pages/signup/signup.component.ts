import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../shared/models/User';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { AuthService } from '../../shared/services/auth.service';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    }),
    favDriver: new FormControl('', [Validators.required]), 
    favTeam: new FormControl('', [Validators.required])
  });

  drivers: Driver[] = [];
  teams: Team[] = [];
  
  showForm = true;
  isLoading = false;
  signupError = '';

  constructor(private authService: AuthService, private firestoreService: FirestoreDataService
  ) {}

  ngOnInit(): void {
    this.firestoreService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });

    this.firestoreService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  }

  async signup(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signupError = 'Please correct the form errors before submitting.';
      return;
    }

    const password = this.signUpForm.get('password')?.value;
    const rePassword = this.signUpForm.get('rePassword')?.value;
    if (password !== rePassword) {
      this.signupError = 'Passwords do not match.';
      return;
    }

    this.showForm = false;
    this.isLoading = true;
    this.signupError = '';

    const userData: Partial<User> = {
      name: {
        firstname: this.signUpForm.value.name?.firstname || '',
        lastname: this.signUpForm.value.name?.lastname || ''
      },
      email: this.signUpForm.value.email || '',
      favDriverID: this.signUpForm.value.favDriver || '',
      favTeamID: this.signUpForm.value.favTeam || ''
    };

    const email = this.signUpForm.value.email || '';
    const pw = this.signUpForm.value.password || '';

    try {
      await this.authService.signUp(email, pw, userData);
    } catch (error: any) {
      this.signupError = this.getFirebaseErrorMessage(error.code);
      this.showForm = true;
    } finally {
      this.isLoading = false;
    }
  }

  private getFirebaseErrorMessage(code: string): string {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password is too weak (min. 6 characters).',
    };
    return map[code] || 'An error occurred. Please try again.';
  }

  getFullName(driver: Driver): string {
    return `${driver.name.firstname} ${driver.name.lastname}`;
  }
}