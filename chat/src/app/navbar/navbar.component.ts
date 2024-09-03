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
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent{
  userData: any = {};

  constructor(private httpClient: HttpClient, private router:Router) {}


}
