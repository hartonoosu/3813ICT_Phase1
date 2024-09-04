import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    //getUserRole is a method in AuthService that returns the user's role
    return this.authService.getUserRole === 'admin';
  }

  get isGroupAdmin(): boolean {
    return this.authService.getUserRole ===  'groupadmin';
  }

  get isUser(): boolean {
    return this.authService.getUserRole === 'user';
  }

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
