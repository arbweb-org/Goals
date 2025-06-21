import { Component } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

export interface Goal {
  title: string;
  description: string;
  deadline: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  isLoading = true;

  goals: Goal[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadGoals();
  }

  async loadGoals() {
    this.http.get<Goal[]>('/api/goals/public').subscribe(goals => {
      this.goals = goals;
      this.goals.sort((b, a) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
}
