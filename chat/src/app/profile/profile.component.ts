import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
  const BACKEND_URL = 'http://localhost:3000/';  // Static property

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']  // Correct styleUrls instead of styleUrl
})

export class ProfileComponent implements OnInit{
  userid = 0;
  username = "";
  useremail = "";
  usergroup = "";
  userrole = "";

  //constructor is to "initialize" or "pre-filled" the value in the form"
  constructor(private router: Router, private httpClient: HttpClient) {
    this.username = sessionStorage.getItem('username')!;
    this.useremail = sessionStorage.getItem('useremail')!;
    this.usergroup = sessionStorage.getItem('usergroup')!;
    this.userrole = sessionStorage.getItem('userrole')!;
    this.userid = Number(sessionStorage.getItem('userid'));
  }

  ngOnInit() {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return;
    }
  }
  editFunc() {
    let userobj = {
      'userid': this.userid,
      'username': this.username,
      'useremail': this.useremail,
      'usergroup': this.usergroup,
      'userrole': this.userrole
    };

    this.httpClient.post<any>(BACKEND_URL + 'loginafter', userobj, httpOptions)
    .subscribe({
      next: (data) => {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('useremail', data.useremail);
        sessionStorage.setItem('usergroup', data.usergroup);
        sessionStorage.setItem('userrole', data.userrole);
        alert('Profile updated successfully!');
        this.router.navigateByUrl("/account");
      },
      error: (error) => {
        console.error('Error updating user data:', error);
      }
    });
  }
}