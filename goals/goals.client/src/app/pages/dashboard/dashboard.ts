import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Goal {
  id: string;
  title: string;
  parentId: string;
  order: number;
  level: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  goals: Goal[] = [];
  newGoal: Goal = { id: '', title: '', parentId: '', order: 0, level: 0 };
  message = '';

  constructor(private http: HttpClient) {
    this.loadGoals();
  }

  async loadGoals() {
    let goals: Goal[] = [];

    goals.push({ id: '1', title: 'Goal 1', parentId: '0', order: 0, level: 0 });
    goals.push({ id: '1.1', title: 'Sub Goal 1.1', parentId: '1', order: 0, level: 0 });
    goals.push({ id: '1.1.2', title: 'Sub Goal 1.1.2', parentId: '1.1', order: 0, level: 0 });
    goals.push({ id: '2.2.1', title: 'Sub Goal 2.2.1', parentId: '2.2', order: 0, level: 0 });

    goals.push({ id: '1.2', title: 'Sub Goal 1.2', parentId: '1', order: 0, level: 0 });
    goals.push({ id: '1.2.1', title: 'Sub Goal 1.2.1', parentId: '1.2', order: 0, level: 0 });
    goals.push({ id: '1.2.2', title: 'Sub Goal 1.2.2', parentId: '1.2', order: 0, level: 0 });

    goals.push({ id: '2.2', title: 'Sub Goal 2.2', parentId: '2', order: 0, level: 0 });
    goals.push({ id: '2.2.2', title: 'Sub Goal 2.2.2', parentId: '2.2', order: 0, level: 0 });

    goals.push({ id: '2', title: 'Goal 2', parentId: '0', order: 0, level: 0 });
    goals.push({ id: '2.1', title: 'Sub Goal 2.1', parentId: '2', order: 0, level: 0 });
    goals.push({ id: '2.1.1', title: 'Sub Goal 2.1.1', parentId: '2.1', order: 0, level: 0 });
    goals.push({ id: '1.1.1', title: 'Sub Goal 1.1.1', parentId: '1.1', order: 0, level: 0 });
    goals.push({ id: '2.1.2', title: 'Sub Goal 2.1.2', parentId: '2.1', order: 0, level: 0 });

    this.goals = this.sortedGoals(goals, '0', 0);
  }

  sortedGoals(goals: Goal[], parentId: string, level: number): Goal[] {
    return goals
      .filter(g => g.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .flatMap(g => {
        g.level = level;
        return [g, ...this.sortedGoals(goals, g.id, level + 1)];
      });
  }

  // Drag and drop plain js
  fromId: string = '';
  toId: string = '';

  onDragStart(event: DragEvent) {
    this.fromId = (event.target as HTMLElement).id.substring(2);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

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

    alert('ok');
  }

  onDropOrder(event: DragEvent) {
    event.preventDefault();
    const elementId = (event.target as HTMLElement).id;
    this.toId = elementId.substring(2);
    if (this.fromId === this.toId) {
      return;
    }

    alert('ok');
  }
}
