import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountComponent } from './account/account.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root URL to /login
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'navbar', component:NavbarComponent},
    {path:'account', component:AccountComponent},

];
