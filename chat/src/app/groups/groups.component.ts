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

interface Member {
  _id: string; // MongoDB ObjectId
  username: string; // Populated username field
}

interface Channel {
  channelId: string;
  channelName: string;
  members?: { _id: string; username: string }[]; // Include _id for reference
}

interface Group {
  groupId: string;
  groupName: string;
  members: { _id: string; username: string }[]; // Include _id for reference
  channels: Channel[];
}



@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  newGroupName: string = '';
  newChannelName: { [key: string]: string } = {}; // Store new channel names by group ID
  newUserId: { [key: string]: string } = {}; // Store user IDs (actually usernames) by group ID
  newUserToChannel: { [key: string]: { [key: string]: string } } = {}; // Store user assignments by group ID and channel ID

  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }

    this.getGroups();
  }

  getGroups(): void {
    this.httpClient.get<Group[]>(BACKEND_URL + 'get-groups-and-channels', httpOptions).subscribe((data: Group[]) => {
      this.groups = data;
  
      // Initialize newUserToChannel for each group and channel
      this.groups.forEach((group: Group) => {
        this.newUserToChannel[group.groupId] = {};
        group.channels.forEach((channel: Channel) => {
          this.newUserToChannel[group.groupId][channel.channelId] = '';
        });
      });
    });
  }
  
  
  
  addGroup(): void {
    const trimmedGroupName = this.newGroupName.trim();
  
    if (!trimmedGroupName) {
      alert("Group name cannot be empty!");
      return;
    }
  
    this.httpClient.post<Group>(BACKEND_URL + 'create-group', { groupName: trimmedGroupName }, httpOptions)
      .subscribe({
        next: (newGroup: Group) => {
          this.groups.push(newGroup);
          this.newUserToChannel[newGroup.groupId] = {}; // Initialize the channels for the new group
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
    const group = this.groups.find(g => g.groupId === groupId);
    if (group && confirm(`Are you sure you want to remove the group "${group.groupName}"?`)) {
      this.httpClient.delete(BACKEND_URL + 'delete-group', {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: { groupId }
      }).subscribe(() => {
        this.groups = this.groups.filter(g => g.groupId !== groupId);
        delete this.newUserToChannel[groupId]; // Remove the associated channels
      });
    }
  }

  addChannel(groupId: string): void {
    const trimmedChannelName = this.newChannelName[groupId]?.trim();
  
    if (!trimmedChannelName) {
      alert("Channel name cannot be empty!");
      return;
    }
  
    this.httpClient.post<Channel>(BACKEND_URL + 'create-channel', { groupId, channelName: trimmedChannelName }, httpOptions)
      .subscribe({
        next: (newChannel: Channel) => {
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.channels.push(newChannel);
            this.newUserToChannel[groupId][newChannel.channelId] = ''; // Initialize the new channel in newUserToChannel
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
    const group = this.groups.find(g => g.groupId === groupId);
    const channel = group?.channels.find((c: Channel) => c.channelId === channelId);
    if (channel && confirm(`Are you sure you want to remove the channel "${channel.channelName}"?`)) {
      this.httpClient.delete(BACKEND_URL + 'delete-channel', {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: { groupId, channelId }
      }).subscribe(() => {
        if (group) {
          group.channels = group.channels.filter((c: Channel) => c.channelId !== channelId);
          delete this.newUserToChannel[groupId][channelId]; // Remove the channel from newUserToChannel
        }
      });
    }
  }

  addUserToGroup(groupId: string): void {
    const trimmedUsername = this.newUserId[groupId]?.trim();

    if (!trimmedUsername) {
        alert("Username cannot be empty!");
        return;
    }

    this.httpClient.post(BACKEND_URL + 'add-user-to-group', { groupId, username: trimmedUsername }, httpOptions)
        .subscribe({
            next: () => {
                const group = this.groups.find(g => g.groupId === groupId);
                if (group) {
                    group.members.push({ _id: "temp", username: trimmedUsername }); // Include a temporary _id
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
  console.log("Group ID sent:", groupId);  // Make sure it’s a valid ObjectId
  console.log("Group ID before sending:", groupId);
  console.log("Username:", username);
  if (confirm(`Are you sure you want to remove ${username} from this group?`)) {
    this.httpClient.post(BACKEND_URL + 'remove-user-from-group', { groupId, username }, httpOptions)
      .subscribe({
        next: () => {
          const group = this.groups.find(g => g.groupId === groupId);
          if (group) {
            group.members = group.members.filter((member) => member.username !== username);
          }
        },
        error: (err) => {
          alert(err.error.error || "An error occurred while removing the user from the group.");
        }
      });
  }
}




  addUserToChannel(groupId: string, channelId: string): void {
    if (!this.newUserToChannel[groupId]) {
        this.newUserToChannel[groupId] = {};
    }

    const username = this.newUserToChannel[groupId][channelId]?.trim();
    if (!username) {
        alert("Username cannot be empty!");
        return;
    }

    this.httpClient.post(BACKEND_URL + 'add-user-to-channel', { groupId, channelId, username }, httpOptions)
        .subscribe({
            next: () => {
                const group = this.groups.find(g => g.groupId === groupId);
                if (group) {
                    const channel = group.channels.find((c: Channel) => c.channelId === channelId);
                    if (channel && channel.members) {
                        channel.members.push({ _id: "temp", username }); // Include a temporary _id
                    }
                }
                this.newUserToChannel[groupId][channelId] = ''; // Clear the input field
            },
            error: (err) => {
                alert(err.error.error || "An error occurred while adding the user to the channel.");
            }
        });
}


  removeUserFromChannel(groupId: string, channelId: string, username: string): void {
    if (confirm(`Are you sure you want to remove ${username} from this channel?`)) {
      this.httpClient.post(BACKEND_URL + 'remove-user-from-channel', { groupId, channelId, username }, httpOptions)
        .subscribe({
          next: () => {
            const group = this.groups.find(g => g.groupId === groupId);
            if (group) {
              const channel = group.channels.find((c: Channel) => c.channelId === channelId);
              if (channel && channel.members) {
                channel.members = channel.members.filter((member) => member.username !== username);
              }
            }
          },
          error: (err) => {
            alert(err.error.error || "An error occurred while removing the user from the channel.");
          }
        });
    }
  }
}
