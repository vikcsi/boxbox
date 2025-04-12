import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../shared/models/User';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import driversData from '../../../../public/data/drivers.json';
import teamsData from '../../../../public/data/teams.json';


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
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    }),
    favDriver : new FormControl('', [Validators.required]), 
    favTeam : new FormControl('', [Validators.required])
});

  drivers: Driver[] = driversData;
  teams: Team[] = teamsData;
  
  showForm = true;
  signupError = '';

  constructor(private router: Router) {}

  signup(): void {
    if (this.signUpForm.invalid) {
      this.signupError = 'Please correct the form errors before submitting.';
      return;
    }

    const password = this.signUpForm.get('password');
    const rePassword = this.signUpForm.get('rePassword');

    if (password?.value !== rePassword?.value) {
      return;
    }

    this.showForm = false;

    const newUser: User = {
      name: {
        firstname: this.signUpForm.value.name?.firstname || '',
        lastname: this.signUpForm.value.name?.lastname || ''
      },
      email: this.signUpForm.value.email || '',
      password: this.signUpForm.value.password || '',
      favDriverID: this.signUpForm.value.favDriver || '',
      favTeamID: this.signUpForm.value.favTeam || ''
    };

    console.log('New user:', newUser);
    console.log('Form value:', this.signUpForm.value);

    this.router.navigateByUrl('/home');
  }

  getFullName(driver: Driver): string {
    return `${driver.name.firstname} ${driver.name.lastname}`;
  }
}