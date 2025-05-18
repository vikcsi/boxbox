import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'standings',
        loadComponent: () => import('./pages/standings/standings.component').then(m => m.StandingsComponent),
        canActivate: [authGuard]

    },
    {
        path: 'drivers',
        loadComponent: () => import('./pages/drivers/drivers.component').then(m => m.DriversComponent),
        canActivate: [authGuard]
    },
    {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams.component').then(m => m.TeamsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'tracks',
        loadComponent: () => import('./pages/tracks/tracks.component').then(m => m.TracksComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'results/:id',
        loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];