import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const BACKEND_URL = 'http://localhost:3000';  // Ensure this is correct

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userData: any = {};
  selectedFile: File | null = null;
  uploadMessage: string = ''; 
  backendUrl: string = BACKEND_URL;  // Pass this URL into the template

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem('userid')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserData();
  }

  loadUserData() {
    const userobj = {
      userid: sessionStorage.getItem('userid'),
      username: sessionStorage.getItem('username'),
      useremail: sessionStorage.getItem('useremail'),
      usergroup: sessionStorage.getItem('usergroup'),
      userrole: sessionStorage.getItem('userrole'),
    };

    this.httpClient.post<any>(`${BACKEND_URL}/loginafter`, userobj).subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Failed to load user data', error);
      },
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadAvatar() {
    const userId = sessionStorage.getItem('userid') || '';

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile, this.selectedFile.name);
      formData.append('userid', userId); 

      this.httpClient.post(`${BACKEND_URL}/upload-avatar`, formData).subscribe({
        next: (response) => {
          console.log('Avatar upload successful!', response);
          this.uploadMessage = 'Avatar uploaded successfully!';
          this.loadUserData(); 
        },
        error: (error) => {
          console.error('Avatar upload failed', error);
          this.uploadMessage = 'Avatar upload failed.';
        },
      });
    } else {
      console.error('No file selected');
      this.uploadMessage = 'Please select a file first!';
    }
  }
}
