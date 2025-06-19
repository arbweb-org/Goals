import { Injectable } from '@nestjs/common';
import { Goal } from './goal.entity';

@Injectable()
export class GoalsService {
    private goals: Goal[] = [];
    createGoal(goal: Goal): string {
        goal.id = Math.random().toString(36).substring(2, 15);
        goal.order = this.goals.length + 1;

        this.goals.push(goal);
        return goal.id;
    }

    findAll(): Goal[] {
        const myGoal: Goal = {
            id: '1',
            title: 'Sample Goal',
            description: null,
            deadline: new Date('2026-12-31'),
            isPublic: true,
            parentId: null,
            order: 1,
            publicId: null,
            ownerId: 'ownerGuid',
            createdAt: new Date(),
        };
        this.goals.push(myGoal);
        return this.goals;
    }

    updateGoal(goal: Goal): boolean {
        const existingGoal = this.goals.find(g => g.id === goal.id);
        if (!existingGoal) {
            return false;
        }

        existingGoal.order = goal.order;
        existingGoal.title = goal.title;
        existingGoal.description = goal.description;
       
        return true;
    }

    deleteGoal(id: string): boolean {
        const index = this.goals.findIndex(g => g.id === id);
        if (index === -1) {
            return false;
        }
        
        this.goals.splice(index, 1);
        return true;
    }
}