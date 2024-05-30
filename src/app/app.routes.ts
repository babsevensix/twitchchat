import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard.service';

export const routes: Routes = [
    {
        path:'sign-in', 
        loadComponent: ()=>import('./pages/sign-in/sign-in.component').then(p=>p.SignInComponent),
        title: 'Twitch Chat - Sign In'

    },
    {
        path: 'sign-up',
        loadComponent: ()=>import('./pages/sign-up/sign-up.component').then(p=>p.SignUpComponent),
        title: 'Twitch Chat - Sign Up'

    },
    {
        path: '',
        loadComponent: ()=>import('./pages/home/home.component').then(p=>p.HomeComponent),
        canActivate: [authGuard],
        title: 'Twitch Chat'

    },
    {
        path: '**',
        redirectTo: ''
    }
];
