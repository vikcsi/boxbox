import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';
import { User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';
import { FirestoreDataService } from '../../shared/services/firestore-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
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

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreDataService
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
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private trySetFavorites(): void {
    if (!this.user || this.drivers.length === 0 || this.teams.length === 0) return;

    this.favoriteDriver = this.drivers.find(d => d.driverID === this.user?.favDriverID);
    this.favoriteTeam = this.teams.find(t => t.teamID === this.user?.favTeamID);
  }
}
