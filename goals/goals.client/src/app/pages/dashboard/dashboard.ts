import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Goal } from '../../goal';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  isPublic = false;
  isLoading = true;
  isEditing = false;

  goals: Goal[] = [];
  newGoal: Goal = new Goal();

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.isPublic = this.route.snapshot.queryParamMap.get('public') === 'true';
      this.newGoal.isPublic = this.isPublic;
      this.loadGoals();
    });
  }

  onRequestError(err: any) {
    if (err.status === 401) {
      alert('Session expired. Please log in again.');
      window.location.href = '/login';
    }
  }

  async loadGoals() {
    const parentId = this.isPublic === true ? '1' : '0';
    const params = new HttpParams().set('isPublic', this.isPublic);
    this.http.get<Goal[]>('/api/goals/dashboard', { params }).subscribe({
      next: (res) => {
        this.goals = this.sortedGoals(res, parentId, 0);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.onRequestError(err);
      }
    });
  }

  sortedGoals(goals: Goal[], parentId: string, level: number): Goal[] {
    return goals
      .filter(g => g.parentId === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .flatMap(g => {
        g.level = level;
        return [g, ...this.sortedGoals(goals, (g.id ?? ''), level + 1)];
      });
  }

  createGoal() {
    const goal = {
      title: this.newGoal.title,
      description: this.newGoal.description,
      deadline: this.newGoal.deadline,
      isPublic: this.newGoal.isPublic
    };
    this.http.post<{ success: boolean }>('/api/goals/create', goal).subscribe(
      {
        next: (res) => {
          window.location.reload();
        },
        error: (err) => {
          alert('Error creating goal');
        }
      }
    );
  }

  updateGoal() {
    const goal = {
      id: this.newGoal.id,
      title: this.newGoal.title,
      description: this.newGoal.description,
      deadline: this.newGoal.deadline
    };
    this.http.put<{ success: boolean }>('/api/goals/update', goal).subscribe(
      {
        next: (res) => {
          window.location.reload();
        },
        error: (err) => {
          alert('Error updating goal');
        }
      }
    );
  }

  editGoalClicked(event: MouseEvent) {
    event.preventDefault();
    this.isEditing = true;

    const elementId = (event.target as HTMLElement).id;
    const id = elementId.substring(2);

    const goal = this.goals.find(g => g.id === id);
    if (!goal) { return; }

    this.newGoal.id = goal.id;
    this.newGoal.title = goal.title;
    this.newGoal.description = goal.description;
    this.newGoal.deadline = goal.deadline;
  }

  togglePublic(event: MouseEvent) {
    event.preventDefault();

    const elementId = (event.target as HTMLElement).id;
    const id = elementId.substring(2);
    this.http.put<{ success: boolean }>(`/api/goals/togglePublic/${id}`, '').subscribe(
      {
        next: (res) => {
          alert('Goal updated successfully');
          window.location.reload();
        },
        error: (err) => {
          alert('Error updating goal');
          window.location.reload();
        }
      }
    );
  }

  deleteGoal(event: MouseEvent) {
    event.preventDefault();

    const elementId = (event.target as HTMLElement).id;
    const id = elementId.substring(2);

    this.http.delete<{ success: boolean }>(`/api/goals/delete/${id}`).subscribe(
      {
        next: (res) => {
          alert('Goal deleted successfully');
          window.location.reload();
        },
        error: (err) => {
          alert('Error deleting goal');
          window.location.reload();
        }
      }
    );
  }
  
  // Drag and drop plain js
  fromId: string = '';
  toId: string = '';

  onDragStart(event: DragEvent) {
    this.fromId = (event.target as HTMLElement).id.substring(2);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    target.style.backgroundColor = '#F6FAF3';
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    target.style.backgroundColor = '';
  }

  // Drop to nest in target goal
  onDropNest(event: DragEvent) {
    event.preventDefault();

    const elementId = (event.target as HTMLElement).id;
    this.toId = elementId.substring(2);
    if (this.fromId === this.toId) {
      return;
    }

    if (elementId.substring(0, 1) === '2') {
      alert('Cannot nest more than 2 levels deep');
      return;
    }

    this.http.put<{ success: boolean }>(`/api/goals/nest/${this.fromId}/${this.toId}`, '').subscribe(
      {
        next: (res) => {
          window.location.reload();
        },
        error: (err) => {
          window.location.reload();
        }
      }
    );
  }

  // Drop to reorder after target goal
  onDropOrder(event: DragEvent) {
    event.preventDefault();

    const elementId = (event.target as HTMLElement).id;
    this.toId = elementId.substring(2);
    if (this.fromId === this.toId) {
      return;
    }

    this.http.put<{ success: boolean }>(`/api/goals/reorder/${this.fromId}/${this.toId}`, '').subscribe(
      {
        next: (res) => {
          window.location.reload();
        },
        error: (err) => {
          window.location.reload();
        }
      }
    );
  }

  signOut(event: MouseEvent) {
    event.preventDefault();

    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
