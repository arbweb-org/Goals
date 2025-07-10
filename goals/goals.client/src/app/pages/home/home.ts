import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Goal } from '../../goal';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isLoading = true;
  parentId = '';

  goals: Goal[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.parentId = this.route.snapshot.queryParamMap.get('parent') ?? '1';
      this.loadGoals();
    });
  }

  async loadGoals() {
    const params = new HttpParams().set('parentId', this.parentId);

    // handle error responses
    this.http.get<Goal[]>('/api/goals/public', { params }).subscribe({
      next: goals => {
        this.goals = goals;
        this.goals.sort((b, a) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        alert('Error loading goals: ' + err.message);

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openSubgoals(event: MouseEvent) {
    const elementId = (event.target as HTMLElement).id;
    const id = elementId.substring(2);

    window.location.href = '/home?parent=' + id;
  }
}
