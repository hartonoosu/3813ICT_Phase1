import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { SocketService } from '../services/socket.service'; // Import SocketService

const BACKEND_URL = 'http://localhost:3000'; // Backend URL for API calls

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  currentMessage: string = '';
  messages: { username: string; content: string; avatarUrl: string }[] = []; // Updated type
  username: string = sessionStorage.getItem('username') || 'Guest';
  avatarUrl: string = sessionStorage.getItem('avatarUrl')
    ? `${BACKEND_URL}${sessionStorage.getItem('avatarUrl')}`
    : ''; // Using absolute URL
  channelId: string = ''; // Stores current channel
  groups: any[] = []; // Stores group names
  channels: any[] = []; // Stores channels for the selected group
  selectedFile: File | null = null; // Stores the selected file for sending images

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private zone: NgZone, // Added NgZone for ensuring Angular runs in the correct zone
    private socketService: SocketService // Inject SocketService
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }

    // Debug session storage content
    console.log('Session Storage Values:', {
      username: sessionStorage.getItem('username'),
      avatarUrl: sessionStorage.getItem('avatarUrl'),
      userid: sessionStorage.getItem('userid'),
    });

    // Initialize Socket.IO
    this.socketService.connect();

    this.socketService.onConnect(() => {
      console.log('Connected to Socket.IO server');
    });

    // Event listener for receiving messages
    this.socketService.onReceiveMessage((message: any) => {
      this.zone.run(() => {
        console.log('Received message:', message);
        this.messages.push({
          username: message.username || 'Unknown',
          content: message.content || '',
          avatarUrl: message.avatarUrl ? `${BACKEND_URL}${message.avatarUrl}` : '',
        });
      });
    });

    // Event listener for users joining a channel
    this.socketService.onUserJoined((message: string) => {
      this.zone.run(() => {
        console.log('User joined message:', message);
        this.messages.push({
          username: 'System',
          content: message,
          avatarUrl: '',
        });
      });
    });

    // Event listener for users leaving a channel
    this.socketService.onUserLeft((message: string) => {
      this.zone.run(() => {
        console.log('User left message:', message);
        this.messages.push({
          username: 'System',
          content: message,
          avatarUrl: '',
        });
      });
    });

    // Listen for previous messages when joining a channel
    this.socketService.onPreviousMessages((messages: any[]) => {
      this.zone.run(() => {
        console.log('Previous messages:', messages);
        this.messages = messages.map((m) => ({
          username: m.username || 'Unknown',
          content: m.content || '',
          avatarUrl: m.avatarUrl ? `${BACKEND_URL}${m.avatarUrl}` : '',
        }));
      });
    });

    this.loadGroupsAndChannels();
  }

  loadGroupsAndChannels(): void {
    this.httpClient
      .get<any>(BACKEND_URL + '/get-groups-and-channels')
      .subscribe({
        next: (data) => {
          this.groups = data; // Populate groups
          console.log('Groups loaded:', this.groups);
        },
        error: (error) => {
          console.error('Failed to load groups and channels', error);
        },
      });
  }

  loadChannelsForGroup(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const groupName = target.value;

    if (groupName) {
      this.channelId = ''; // Clear current channel selection
      this.channels = []; // Clear channels
      this.httpClient
        .post<any>(BACKEND_URL + '/get-channel', { groupName })
        .subscribe({
          next: (data) => {
            this.channels = data.channels || []; // Ensure channels is an array or set as empty
            console.log('Channels loaded for group:', groupName, this.channels);

            // Automatically select the first channel if it's available
            if (this.channels.length > 0) {
              const defaultChannelId = this.channels[0].channelId;
              this.joinChannelById(defaultChannelId);
            }
          },
          error: (error) => {
            console.error('Failed to load channels', error);
          },
        });
    } else {
      console.error('No group selected');
    }
  }

  joinChannel(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedChannelId = target.value;
    console.log('Selected Channel ID:', selectedChannelId); // Add this line for debugging
    this.joinChannelById(selectedChannelId);
  }
  
  joinChannelById(channelIdParam: string): void {
    if (channelIdParam) {
      const selectedChannel = this.channels.find(
        (channel) => channel._id === channelIdParam || channel._id === channelIdParam
      );
  
      if (selectedChannel) {
        if (this.channelId !== (selectedChannel.channelId || selectedChannel._id)) {
          if (this.channelId) {
            this.socketService.leaveChannel({
              channelId: this.channelId,
              username: this.username,
            });
          }
  
          this.channelId = selectedChannel.channelId || selectedChannel._id;
          this.messages = []; // Clear previous messages to avoid showing old data
  
          console.log('Joining new channel:', this.channelId); // Log the new channelId
  
          this.socketService.joinChannel({
            channelId: this.channelId,
            username: this.username,
          });
  
          this.httpClient
            .post<any>(BACKEND_URL + '/get-messages', {
              channelId: this.channelId,
            })
            .subscribe({
              next: (data) => {
                this.zone.run(() => {
                  this.messages = data.map((m: any) => ({
                    username: m.username || 'Unknown',
                    content: m.content || '',
                    avatarUrl: m.avatarUrl
                      ? `${BACKEND_URL}${m.avatarUrl}`
                      : '', // Using absolute URL for consistency
                  }));
                  console.log('Messages for new channel:', this.messages);
                });
              },
              error: (error) => {
                console.error(
                  'Failed to load messages for the new channel',
                  error
                );
              },
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

      this.socketService.sendMessage({
        channelId: this.channelId,
        message: this.currentMessage,
        username: this.username,
        avatarUrl: this.avatarUrl,
      });

      this.zone.run(() => {
        this.currentMessage = ''; // Clear the input after sending
      });
    } else {
      console.error('Cannot send an empty message.');
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  sendImage(): void {
    if (!this.channelId) {
      console.error('Cannot send image: No channel selected');
      alert('Please select a channel before sending an image.');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('channelId', this.channelId);
      formData.append('username', this.username);
      formData.append('avatarUrl', this.avatarUrl);
      formData.append('image', this.selectedFile);

      this.httpClient
        .post<any>(`${BACKEND_URL}/send-image`, formData)
        .subscribe({
          next: (data) => {
            console.log('Image sent successfully:', data);
            this.socketService.sendImage({
              channelId: this.channelId,
              username: this.username,
              avatarUrl: this.avatarUrl,
              imageUrl: data.imageUrl, // Use the full URL returned from the server
            });
            this.selectedFile = null; // Clear the selected file after upload
          },
          error: (error) => {
            console.error('Failed to send image', error);
          },
        });
    } else {
      console.error('No image selected to send.');
    }
  }

  extractImageUrl(content: string): string {
    const match = content.match(/src="([^"]*)"/);
    return match ? match[1] : '';
  }
}
