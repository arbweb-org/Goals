import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  register() {
    const user = {
      email: this.email,
      password: this.password
    };

    this.message = 'Please wait...';
    this.http.post('/api/users/register', user, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.message = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = err.error;
        this.cdr.detectChanges();
      }
    });
  }
}
