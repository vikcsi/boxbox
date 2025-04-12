import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { TeamService } from '../../services/team.service';
import { Driver } from '../../shared/models/Driver';
import { Team } from '../../shared/models/Team';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  favoriteDriver: Driver | undefined;
  favoriteTeam: Team | undefined;

  constructor(
    private userService: UserService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    
    if (this.user) {
      this.favoriteDriver = this.teamService.getDriverById(this.user.favDriverID);
      this.favoriteTeam = this.teamService.getTeamById(this.user.favTeamID);
    }
  }
}