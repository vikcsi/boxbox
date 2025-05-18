import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  favoriteDriver: Driver | undefined;
  favoriteTeam: Team | undefined;
  drivers: Driver[] = [];
  teams: Team[] = [];
  private userSubscription?: Subscription;
  isEditing = false;
  editForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.firestoreService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
      this.trySetFavorites();
    });

    this.firestoreService.getTeams().subscribe(teams => {
      this.teams = teams;
      this.trySetFavorites();
    });

    this.userSubscription = this.authService.userProfile.subscribe(profile => {
      this.user = profile;
      this.trySetFavorites();
    });

    this.initForm();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private trySetFavorites(): void {
    if (!this.user || this.drivers.length === 0 || this.teams.length === 0) return;

    this.favoriteDriver = this.drivers.find(d => d.driverID === this.user?.favDriverID);
    this.favoriteTeam = this.teams.find(t => t.teamID === this.user?.favTeamID);
  }

  initForm(): void {
  this.editForm = this.fb.group({
    firstname: [this.user?.name?.firstname || '', [Validators.required, Validators.minLength(2)]],
    lastname: [this.user?.name?.lastname || '', [Validators.required, Validators.minLength(2)]],
    favDriverID: [this.user?.favDriverID || '', Validators.required],
    favTeamID: [this.user?.favTeamID || '', Validators.required]
  });
}

toggleEdit(): void {
  this.isEditing = !this.isEditing;
  if (this.isEditing) {
    this.initForm(); 
  }
}

async saveProfile(): Promise<void> {
  if (this.editForm.invalid) return;

  const updatedData: Partial<User> = {
    name: {
      firstname: this.editForm.value.firstname,
      lastname: this.editForm.value.lastname
    },
    favDriverID: this.editForm.value.favDriverID,
    favTeamID: this.editForm.value.favTeamID
  };

  try {
    await this.authService.updateUserProfile(updatedData);
    this.isEditing = false;
  } catch (error) {
  }
}
}
