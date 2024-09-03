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
  styleUrls: ['./login.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})

export class LoginComponent {
  username = "";
  password = "";

  constructor(private router: Router, private httpClient: HttpClient) {}
  
  submit(){
    let user = {username:this.username, pwd: this.password};
    this.httpClient.post(BACKEND_URL + 'login', user, httpOptions)
    //this.httpClient.post(BACKEND_URL+'login', user)
    .subscribe((data: any) => {
      // alert("posting: " + JSON.stringify(user));
      // alert("postRes: " + JSON.stringify(data));
      if (data.ok) {
        // alert("correct!");
        sessionStorage.setItem("userid", data.userid.toString());
        sessionStorage.setItem("userlogin", data.ok.toString());
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("useremail", data.useremail);
        sessionStorage.setItem("usergroup", data.usergroup.toString());
        sessionStorage.setItem("userchannel", data.userchannel.toString());
        this.router.navigateByUrl("/account");
    } else {
        alert("Email or password incorrect!");
    }
    
  })
  }
}
