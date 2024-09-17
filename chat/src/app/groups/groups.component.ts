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

// Define the interface at the top of the file
interface Channel {
  channelId: string;
  channelName: string;
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: any[] = [];
  newGroupName: string = '';
  newChannelName: { [key: string]: string } = {}; // Initialize as an object
  newUserId: { [key: string]: string } = {}; // Store user IDs by group

  constructor(private router: Router, private httpClient: HttpClient) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.getGroups();
  }

  getGroups(): void {
    this.httpClient.get(BACKEND_URL + 'get-groups-and-channels', httpOptions).subscribe((data: any) => {
      this.groups = data;
    });
  }

  addGroup(): void {
    if (this.newGroupName.trim()) {
      this.httpClient.post(BACKEND_URL + 'create-group', { groupName: this.newGroupName.trim() }, httpOptions)
        .subscribe((newGroup: any) => {
          this.groups.push(newGroup);
          this.newGroupName = '';
        });
    }
  }

  removeGroup(groupId: string): void {
    this.httpClient.delete(BACKEND_URL + 'delete-group', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { groupId }
    }).subscribe(() => {
      this.groups = this.groups.filter(g => g.groupId !== groupId);
    });
  }

  addChannel(groupId: string): void {
    if (this.newChannelName[groupId]?.trim()) {
      this.httpClient.post(BACKEND_URL + 'create-channel', { groupId, channelName: this.newChannelName[groupId].trim() }, httpOptions)
        .subscribe((newChannel: any) => {
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.channels.push(newChannel);
          }
          this.newChannelName[groupId] = ''; // Clear the input field for this group
        });
    }
  }

  removeChannel(groupId: string, channelId: string): void {
    this.httpClient.delete(BACKEND_URL + 'delete-channel', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { groupId, channelId }
    }).subscribe(() => {
      const group = this.groups.find(g => g.groupId === groupId);
      if (group) {
        group.channels = group.channels.filter((c: Channel) => c.channelId !== channelId);
      }
    });
  }

  addUserToGroup(groupId: string): void {
    if (this.newUserId[groupId]?.trim()) {
      this.httpClient.post(BACKEND_URL + 'add-user-to-group', { groupId, userId: this.newUserId[groupId].trim() }, httpOptions)
        .subscribe((response: any) => {
          // Update the group with the new user
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.members.push(this.newUserId[groupId].trim());
          }
          this.newUserId[groupId] = ''; // Clear the input field
      });
    }
  }

  removeUserFromGroup(groupId: string, userId: string): void {
    this.httpClient.post(BACKEND_URL + 'remove-user-from-group', { groupId, userId }, httpOptions)
      .subscribe((response: any) => {
        const group = this.groups.find(g => g.groupId === groupId);
        if (group) {
          group.members = group.members.filter((id: string) => id !== userId);  // Explicitly typed as string
        }
      });
  }
  
  
}

