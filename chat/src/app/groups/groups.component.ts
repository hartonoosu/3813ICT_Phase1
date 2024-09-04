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
  selector: 'app-groups',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})

// TODO: do the real data retrieval!!

export class GroupsComponent implements OnInit {
  groups: string[] = [];
  newGroupName: string = '';

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Initialize with some default groups
    this.groups = ['Admin Group', 'User Group', 'Guest Group'];
  }

  addGroup(): void {
    if (this.newGroupName.trim()) {
      this.groups.push(this.newGroupName.trim());
      this.newGroupName = ''; // Clear the input field
    }
  }

  removeGroup(group: string): void {
    this.groups = this.groups.filter(g => g !== group);
  }
}
