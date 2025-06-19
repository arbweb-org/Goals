import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) { }

  login() {
    const user = {
      email: this.email,
      password: this.password
    };

    this.message = 'Please wait...';
    this.http.post('/api/users/login', user, { responseType: 'text' }).subscribe({
      next: (res) => this.message = res,
      error: (err) => this.message = err.error
    });
  }
}
