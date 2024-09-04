import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userrole');
  }

  get isAdmin(): boolean {
    return sessionStorage.getItem('userrole') === 'admin';
  }

  get isGroupAdmin(): boolean {
    return sessionStorage.getItem('userrole') === 'groupadmin';
  }

  get isUser(): boolean {
    return sessionStorage.getItem('userrole') === 'user';
  }

  constructor(private router: Router) {}

  logout() {
    sessionStorage.clear(); // Clear all session storage data on logout
    this.router.navigate(['/login']);
  }
}
