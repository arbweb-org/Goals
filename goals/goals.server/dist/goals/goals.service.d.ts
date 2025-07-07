import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
export declare class GoalsService {
    private goalRepo;
    constructor(goalRepo: Repository<Goal>);
    findByParent(parentId: string): Promise<Goal[]>;
    findByUser(userId: string, isPublic: boolean): Promise<Goal[]>;
    createGoal(userId: string, goalData: Partial<Goal>): Promise<boolean>;
    updateGoal(userId: string, goalData: Partial<Goal>): Promise<boolean>;
    nestGoal(userId: string, sourceId: string, targetId: string): Promise<boolean>;
    reorderGoal(userId: string, sourceId: string, targetId: string): Promise<boolean>;
    togglePublic(userId: string, id: string): Promise<boolean>;
    toggleRecursive(goal: Goal, updatables: Goal[]): Promise<boolean>;
    deleteGoal(userId: string, id: string): Promise<boolean>;
    deleteRecursive(goal: Goal, deletables: Goal[]): Promise<boolean>;
}
