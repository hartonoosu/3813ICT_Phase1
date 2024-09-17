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
  usergroup = ''; 
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
          alert(`User created successfully! Username: ${data.username}, Password: ${data.password}`);
          this.clearForm();
        },
        error: (error) => {
          if (error.status === 409) {
            alert('Username already exists. Please choose a different username.');
          } else if (error.status === 400 && error.error.message === 'Group does not exist') {
            alert('The specified group does not exist. Please choose a valid group.');
          } else {
            console.error('Error creating user:', error);
            alert('An unexpected error occurred while creating the user.');
          }
        }
      });
  }

  removeUser() {
    if (!this.removeUsername.trim()) {
      alert('Please enter a username to remove.');
      return;
    }

    if (confirm(`Are you sure you want to remove the user: ${this.removeUsername}?`)) {
      this.httpClient.delete<any>(BACKEND_URL + 'removeUser/' + this.removeUsername.trim(), httpOptions)
        .subscribe({
          next: () => {
            alert('User removed successfully!');
            this.removeUsername = '';
          },
          error: (error) => {
            if (error.status === 404) {
              alert('User not found. Please check the username and try again.');
            } else {
              console.error('Error removing user:', error);
              alert('An unexpected error occurred while removing the user.');
            }
          }
        });
    }
  }

  clearForm() {
    this.username = '';
    this.useremail = '';
    this.userrole = 'user';
    this.usergroup = ''; 
  }
}
