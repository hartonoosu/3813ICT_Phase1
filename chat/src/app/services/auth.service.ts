import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') ? true : false;
  }

  getUserRole(): string | null{
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);  // Correctly parsing the string to an object
      return user.role;  // Now accessing the role property of the object
    }
    return null;
  }
}
