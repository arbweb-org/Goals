import { Goal } from './goal.entity';
export declare class GoalsService {
    private goals;
    createGoal(goal: Goal): string;
    findAll(): Goal[];
    updateGoal(goal: Goal): boolean;
    deleteGoal(id: string): boolean;
}
