import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = 'http://localhost:3000/';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  username = '';
  useremail = '';
  userrole = 'user';
  usergroup = ''; // Add this property
  removeUsername = '';

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit() {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }
  }

  createUser() {
    const userObj = {
      'username': this.username,
      'useremail': this.useremail,
      'userrole': this.userrole,
      'usergroup': this.usergroup 
    };

    this.httpClient.post<any>(BACKEND_URL + 'createUser', userObj, httpOptions)
      .subscribe({
        next: (data) => {
          alert('User created successfully!');
          this.clearForm();
        },
        error: (error) => {
          if (error.status === 409) {
            alert('Username already exists. Please choose a different username.');
          } else {
            console.error('Error creating user:', error);
          }
        }
      });
  }

  removeUser() {
    this.httpClient.delete<any>(BACKEND_URL + 'removeUser/' + this.removeUsername, httpOptions)
      .subscribe({
        next: () => {
          alert('User removed successfully!');
          this.removeUsername = '';
        },
        error: (error) => {
          console.error('Error removing user:', error);
        }
      });
  }

  clearForm() {
    this.username = '';
    this.useremail = '';
    this.userrole = 'user';
    this.usergroup = ''; 
  }
}
