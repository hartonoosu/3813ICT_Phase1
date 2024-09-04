import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root URL to /login
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'account', component:AccountComponent},
    {path:'profile', component:ProfileComponent},

];
