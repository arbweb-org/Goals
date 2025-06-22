import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
export declare class GoalsService {
    private goalRepo;
    constructor(goalRepo: Repository<Goal>);
    findAll(userId: string): Promise<Goal[]>;
    createGoal(userId: string, goalData: Partial<Goal>): Promise<boolean>;
    updateGoal(userId: string, goalData: Partial<Goal>): Promise<boolean>;
    nestGoal(userId: string, sourceId: string, targetId: string): Promise<boolean>;
    reorderGoal(userId: string, sourceId: string, targetId: string): Promise<boolean>;
    setPublic(userId: string, id: string): Promise<boolean>;
    setPublicTree(id: string): Promise<boolean>;
    deleteGoal(userId: string, id: string): Promise<boolean>;
    deleteGoalTree(id: string): Promise<boolean>;
}
