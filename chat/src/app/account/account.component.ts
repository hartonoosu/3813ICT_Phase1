import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

 const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

 const BACKEND_URL = 'http://localhost:3000/';

  @Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit{
  userData: any = {};

  constructor(private httpClient: HttpClient, private router:Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return;
    }
    this.loadUserData();
  }

  loadUserData() {
    const userobj = {
      userid: sessionStorage.getItem("userid"),
      username: sessionStorage.getItem("username"),
      useremail: sessionStorage.getItem("useremail"),
      usergroup: sessionStorage.getItem("usergroup"),
      userrole: sessionStorage.getItem("userrole")
    };

    this.httpClient.post<any>(BACKEND_URL + 'loginafter', userobj, httpOptions)
      .subscribe({
        next: (data) => {
          this.userData = data;
        },
        error: (error) => {
          console.error('Failed to load user data', error);
        }
      });
  }
}
