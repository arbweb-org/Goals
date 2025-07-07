import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    getPublicGoals(parentId: string): Promise<Goal[]>;
    getDashboard(req: any, isPublic: boolean): Promise<Goal[]>;
    createGoal(req: any, goal: Partial<Goal>): Promise<{
        success: boolean;
    }>;
    updateGoal(req: any, goal: Partial<Goal>): Promise<{
        success: boolean;
    }>;
    nestGoal(req: any, sourceId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    reorderGoal(req: any, sourceId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    togglePublic(req: any, id: string): Promise<{
        success: boolean;
    }>;
    deleteGoal(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
