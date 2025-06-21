import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
export declare class GoalsService {
    private goalRepo;
    constructor(goalRepo: Repository<Goal>);
    findAll(isPublic: boolean): Promise<Goal[]>;
    createGoal(goalData: Partial<Goal>): Promise<boolean>;
    updateGoal(goalData: Partial<Goal>): Promise<boolean>;
    nestGoal(sourceId: string, targetId: string): Promise<boolean>;
    reorderGoal(sourceId: string, targetId: string): Promise<boolean>;
    setPublic(id: string): Promise<boolean>;
    setPublicTree(id: string): Promise<boolean>;
    deleteGoal(id: string): Promise<boolean>;
    deleteGoalTree(id: string): Promise<boolean>;
}
