import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

export interface Goal {
  id?: string;
  title: string;
  description: string;
  deadline: string;
  parentId?: string;
  order?: number;
  level?: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  isLoading = true;
  isEditing = false;

  goals: Goal[] = [];
  newGoal: Goal = {
    title: '',
    description: '',
    deadline: (new Date()).toISOString(),
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadGoals();
  }

  async loadGoals() {
    this.http.get<Goal[]>('/api/goals/private').subscribe(
      {
        next: (res) => {
          this.goals = this.sortedGoals(res, '0', 0);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          window.location.href = '/login';
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
    this.newGoal.deadline = new Date(this.newGoal.deadline).toISOString();
    this.http.post<{ success: boolean }>('/api/goals/create', this.newGoal).subscribe(
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
    this.http.put<{ success: boolean }>('/api/goals/update', this.newGoal).subscribe(
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
    if (goal) {
      this.newGoal.title = goal.title;
      this.newGoal.description = goal.description;
      this.newGoal.deadline = goal.deadline;
    }
  }

  setPublic(event: MouseEvent) {
    event.preventDefault();

    const elementId = (event.target as HTMLElement).id;
    const id = elementId.substring(2);
    this.http.put<{ success: boolean }>(`/api/goals/setpublic/${id}`, '').subscribe(
      {
        next: (res) => {
          alert('Goal set to public successfully');
          window.location.reload();
        },
        error: (err) => {
          alert('Error setting goal to public');
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
