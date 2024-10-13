import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

const BACKEND_URL = 'http://localhost:3000/';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, JsonPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username = "";
  password = "";

  constructor(private router: Router, private httpClient: HttpClient) {}
  
  submit() {
    const user = {
      username: this.username,
      pwd: this.password
    };

    this.httpClient.post(BACKEND_URL + 'login', user, httpOptions)
    .subscribe((data: any) => {
      if (data.ok) {
        // Store user data in sessionStorage
        sessionStorage.setItem("userid", data.userid.toString());
        sessionStorage.setItem("userlogin", data.ok.toString());
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("useremail", data.useremail);
        sessionStorage.setItem("usergroup", data.usergroup.toString());
        sessionStorage.setItem("userrole", data.userrole);
        
        // Navigate to account page
        this.router.navigateByUrl("/account");
      } else {
        alert("Username or password incorrect!");
      }
    }, error => {
      console.error('Login failed', error);
      alert("An error occurred during login.");
    });
  }
}
