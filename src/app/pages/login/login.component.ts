import { Component, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  isLoading: boolean = false;
  loginError: string = '';
  authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Ha már be van jelentkezve, irányítsuk át a főoldalra
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  async login(): Promise<void> {
    // Return early if invalid inputs
    if (this.email.invalid) {
      this.loginError = 'Please enter a valid email address';
      return;
    }

    if (this.password.invalid) {
      this.loginError = 'Password must be at least 6 characters';
      return;
    }

    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';

    this.isLoading = true;
    this.loginError = '';

    try {
      await this.authService.signIn(emailValue, passwordValue);
      // Bejelentkezés után elnavigálunk a főoldalra
      // (most már az AuthService.signIn metódusban van kezelve)
    } catch (error: any) {
      this.loginError = this.getFirebaseErrorMessage(error.code);
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getFirebaseErrorMessage(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.'
    };
    return map[code] || 'Login failed. Please try again.';
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}