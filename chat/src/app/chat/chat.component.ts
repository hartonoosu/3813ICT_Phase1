import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = 'http://localhost:3000/';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }
  }

  sendMessage(): void {
    
  }
}
