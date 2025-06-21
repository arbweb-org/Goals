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
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user: User = { email: '', password: '' };
  message = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  register() {
    this.message = 'Please wait...';
    this.http.post<User>('/api/users/register', this.user).subscribe({
      next: (response: User) => {
        this.message = '';
        this.cdr.detectChanges();
        alert('Registration successful!');
        window.location.href = '/login';
      },
      error: (error: any) => {
        this.message = 'Registration failed: ' + (error.error?.message || 'Unknown error');
        this.cdr.detectChanges();
      }
    });
  }
}
