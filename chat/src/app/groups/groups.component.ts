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

  constructor(private router: Router, private httpClient: HttpClient) { }

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
    const trimmedGroupName = this.newGroupName.trim();

    if (!trimmedGroupName) {
      alert("Group name cannot be empty!");
      return;
    }

    this.httpClient.post(BACKEND_URL + 'create-group', { groupName: trimmedGroupName }, httpOptions)
      .subscribe({
        next: (newGroup: any) => {
          this.groups.push(newGroup);
          this.newGroupName = ''; // Clear the input field
        },
        error: (err) => {
          if (err.status === 400 && err.error.error === "Group name already exists") {
            alert("Group name already exists!");  // Display alert if duplicate detected
          } else {
            alert("An error occurred while creating the group.");
          }
        }
      });
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
    const trimmedChannelName = this.newChannelName[groupId]?.trim();

    if (!trimmedChannelName) {
      alert("Channel name cannot be empty!");
      return;
    }

    this.httpClient.post(BACKEND_URL + 'create-channel', { groupId, channelName: trimmedChannelName }, httpOptions)
      .subscribe({
        next: (newChannel: any) => {
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.channels.push(newChannel);
          }
          this.newChannelName[groupId] = ''; // Clear the input field for this group
        },
        error: (err) => {
          if (err.status === 400 && err.error.error === "Channel name already exists in this group") {
            alert("Channel name already exists in this group!");
          } else {
            alert("An error occurred while creating the channel.");
          }
        }
      });
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
    const trimmedUsername = this.newUserId[groupId]?.trim();  // Assuming `newUserId` now holds the username

    if (!trimmedUsername) {
      alert("Username cannot be empty!");
      return;
    }

    this.httpClient.post(BACKEND_URL + 'add-user-to-group', { groupId, username: trimmedUsername }, httpOptions)
      .subscribe({
        next: (response: any) => {
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.members.push(trimmedUsername);
          }
          this.newUserId[groupId] = ''; // Clear the input field
        },
        error: (err) => {
          if (err.status === 400 && err.error.error === "User does not exist") {
            alert("User does not exist!");
          } else if (err.status === 400 && err.error.error === "User already in group") {
            alert("User is already a member of this group!");
          } else {
            alert("An error occurred while adding the user to the group.");
          }
        }
      });
  }

  removeUserFromGroup(groupId: string, username: string): void {
    if (confirm(`Are you sure you want to remove ${username} from this group?`)) {
      this.httpClient.post(BACKEND_URL + 'remove-user-from-group', { groupId, username }, httpOptions)
        .subscribe({
          next: () => {
            const group = this.groups.find(g => g.groupId === groupId);
            if (group) {
              group.members = group.members.filter((member: string) => member !== username);
            }
          },
          error: (err) => {
            alert(err.error.error || "An error occurred while removing the user from the group.");
          }
        });
    }
  }
  
}
