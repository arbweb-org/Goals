import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  user: User = { email: '', password: '' };
  message = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  login() {
    this.message = 'Please wait...';
    this.http.post<{ success: boolean, token: string }>('/api/users/login', this.user).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        this.message = '';
        this.cdr.detectChanges();
        alert('Login successful!');
        window.location.href = '/dashboard?public=true';
      },
      error: (error: any) => {
        this.message = 'Login failed: ' + (error.error?.message || 'Unknown error');
        this.cdr.detectChanges();
      }
    });
  }
}
