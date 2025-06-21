import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    getPublicGoals(): Promise<Goal[]>;
    getPrivateGoals(): Promise<Goal[]>;
    createGoal(goal: Partial<Goal>): Promise<{
        success: boolean;
    }>;
    updateGoal(goal: Partial<Goal>): Promise<{
        success: boolean;
    }>;
    nestGoal(sourceId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    reorderGoal(sourceId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    setGoalPublic(id: string): Promise<{
        success: boolean;
    }>;
    deleteGoal(id: string): Promise<{
        success: boolean;
    }>;
}
