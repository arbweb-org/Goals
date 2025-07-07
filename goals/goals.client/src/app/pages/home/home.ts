import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Goal } from '../../goal';

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
    const params = new HttpParams().set('parentId', '1');
    this.http.get<Goal[]>('/api/goals/public', { params }).subscribe(goals => {
      this.goals = goals;
      this.goals.sort((b, a) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());

      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
}
