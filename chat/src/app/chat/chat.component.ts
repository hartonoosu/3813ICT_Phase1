import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Your backend URL
const BACKEND_URL = 'http://localhost:3000'; // Backend URL for API calls

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  socket: any;
  currentMessage: string = '';
  messages: string[] = [];
  username: string = sessionStorage.getItem('username') || 'Guest';
  channelId: string = ''; // Stores current channel
  groups: any[] = []; // Stores group names
  channels: any[] = []; // Stores channels for the selected group

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private zone: NgZone // Added NgZone for ensuring Angular runs in the correct zone
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true, // Allows reconnecting if the initial attempt fails
      transports: ['websocket', 'polling'], // Ensure both polling and websocket transports are supported
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server with id:', this.socket.id);
    });

    // Event listener for receiving messages
    this.socket.on('receiveMessage', (message: string) => {
      this.zone.run(() => {
        console.log('Received message:', message);
        this.messages.push(message);
      });
    });

    // Event listener for users joining a channel
    this.socket.on('userJoined', (message: string) => {
      this.zone.run(() => {
        console.log('User joined message:', message);
        this.messages.push(message);
      });
    });

    // Listen for previous messages when joining a channel
    this.socket.on('previousMessages', (messages: any[]) => {
      this.zone.run(() => {
        console.log('Previous messages:', messages);
        this.messages = messages.map(m => `${m.username}: ${m.content}`);
      });
    });

    this.loadGroupsAndChannels();
  }

  loadGroupsAndChannels(): void {
    this.httpClient.get<any>(BACKEND_URL + '/get-groups-and-channels').subscribe({
      next: (data) => {
        this.groups = data; // Populate groups
        console.log('Groups loaded:', this.groups);
      },
      error: (error) => {
        console.error('Failed to load groups and channels', error);
      }
    });
  }

  loadChannelsForGroup(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const groupName = target.value;
  
    if (groupName) {
      this.httpClient.post<any>(BACKEND_URL + '/get-channel', { groupName }).subscribe({
        next: (data) => {
          this.channels = data.channels || []; // Ensure channels is an array or set as empty
          console.log('Channels loaded for group:', groupName, this.channels);
          
          // Automatically select the first channel if it's available
          if (this.channels.length > 0) {
            // Assuming the first channel should be selected by default
            const defaultChannelId = this.channels[0].channelId;
            this.joinChannelById(defaultChannelId);
          }
        },
        error: (error) => {
          console.error('Failed to load channels', error);
        }
      });
    } else {
      console.error('No group selected');
    }
  }
  
  joinChannel(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedChannelId = target.value;
    this.joinChannelById(selectedChannelId);
  }

  joinChannelById(channelIdParam: string): void {
    if (channelIdParam) {
      // Find the selected channel by channelId
      const selectedChannel = this.channels.find(channel => channel.channelId === channelIdParam);
  
      if (selectedChannel) {
        if (this.channelId !== selectedChannel.channelId) {
          // Leave the previous channel if any
          if (this.channelId) {
            this.socket.emit('leaveChannel', { channelId: this.channelId, username: this.username });
          }
  
          // Set the new channel ID
          this.channelId = selectedChannel.channelId;
          this.messages = []; // Clear previous messages to avoid showing old data
  
          console.log('Joining new channel:', this.channelId); // Log the new channelId
  
          // Join the new channel
          this.socket.emit('joinChannel', { channelId: this.channelId, username: this.username });
  
          // Fetch previous messages for the newly selected channel
          this.httpClient.post<any>(BACKEND_URL + '/get-messages', { channelId: this.channelId }).subscribe({
            next: (data) => {
              this.zone.run(() => {
                this.messages = data.map((m: any) => `${m.username}: ${m.content}`);
                console.log('Messages for new channel:', this.messages);
              });
            },
            error: (error) => {
              console.error('Failed to load messages for the new channel', error);
            }
          });
        }
      } else {
        console.error('Selected channel not found in channels list.');
      }
    } else {
      console.error('No channel selected');
    }
  }
  
  sendMessage(): void {
    if (!this.channelId) {
      console.error('Cannot send message: No channel selected');
      alert('Please select a channel before sending a message.');
      return;
    }

    if (this.currentMessage.trim() !== '') {
      console.log('Sending message from:', this.username);
      console.log('Channel ID:', this.channelId);
      console.log('Message content:', this.currentMessage);

      this.socket.emit('sendMessage', {
        channelId: this.channelId,
        message: this.currentMessage,
        username: this.username
      });

      this.zone.run(() => {
        this.currentMessage = ''; // Clear the input after sending
      });
    } else {
      console.error('Cannot send an empty message.');
    }
  }
}
