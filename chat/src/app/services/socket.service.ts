import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      reconnection: true,
      transports: ['websocket', 'polling'],
    });
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  onConnect(callback: () => void): void {
    this.socket.on('connect', callback);
  }

  onReceiveMessage(callback: (message: any) => void): void {
    this.socket.on('receiveMessage', callback);
  }

  onUserJoined(callback: (message: string) => void): void {
    this.socket.on('userJoined', callback);
  }

  onUserLeft(callback: (message: string) => void): void {
    this.socket.on('userLeft', callback);
  }

  onPreviousMessages(callback: (messages: any[]) => void): void {
    this.socket.on('previousMessages', callback);
  }

  joinChannel(data: { channelId: string; username: string }): void {
    this.socket.emit('joinChannel', data);
  }

  leaveChannel(data: { channelId: string; username: string }): void {
    this.socket.emit('leaveChannel', data);
  }

  sendMessage(data: {
    channelId: string;
    message: string;
    username: string;
    avatarUrl: string;
  }): void {
    this.socket.emit('sendMessage', data);
  }

  sendImage(data: {
    channelId: string;
    username: string;
    avatarUrl: string;
    imageUrl: string;
  }): void {
    this.socket.emit('sendImage', data);
  }
}
