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
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return !!sessionStorage.getItem('userrole');
    }
    return false; // Return false if sessionStorage is not available
  }

  get isAdmin(): boolean {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userrole') === 'admin';
    }
    return false;
  }

  get isGroupAdmin(): boolean {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userrole') === 'groupadmin';
    }
    return false;
  }

  get isUser(): boolean {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userrole') === 'user';
    }
    return false;
  }

  constructor(private router: Router) {}

  logout() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.clear(); // Clear all session storage data on logout
    }
    this.router.navigate(['/login']);
  }
}
