import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { AdminComponent } from './admin/admin.component';
import { GroupsComponent } from './groups/groups.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root URL to /login
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'account', component:AccountComponent},
    {path:'profile', component:ProfileComponent},
    {path:'chat', component:ChatComponent},
    {path:'admin', component: AdminComponent},
    {path:'groups', component: GroupsComponent},

];
