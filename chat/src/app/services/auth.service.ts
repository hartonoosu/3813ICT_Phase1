import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = "";
  isLoggedIn = true;
  getUserRole = "admin";

  constructor(private router: Router, private httpClient: HttpClient) { }

   // Read from session storage
   getSession() {
    if (!sessionStorage.getItem("user")) {
      // no valid session relocate to login page
      this.isLoggedIn = false;
      alert("Not logged in!");
      this.router.navigate(['/login']);
    } else {
      this.user = JSON.parse(sessionStorage.getItem("user") || "");
      this.isLoggedIn = true;
    }
    return this.user;
  }

    // Save to session storage
    saveSession(data: any) {
      this.user = JSON.stringify(data);
      sessionStorage.setItem("user", this.user);
      this.isLoggedIn = false; // Set to true upon saving session
    }  

  // Update user info
  userUpdate(user: any){
    // Save to server
    this.httpClient.post<any>(BACKEND_URL + '/auth/update', user,  httpOptions)
      .subscribe((data: any) => {
        // Save to session storage
      this.saveSession(data);
      });
  }

  // Clear session to Logout
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }
}
