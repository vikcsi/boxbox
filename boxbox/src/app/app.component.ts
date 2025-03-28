import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { DriversComponent } from './pages/drivers/drivers.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BoardComponent } from './pages/board/board.component';
import { TracksComponent } from './pages/tracks/tracks.component';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, DriversComponent, TeamsComponent, ProfileComponent, BoardComponent, TracksComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boxbox';
}
