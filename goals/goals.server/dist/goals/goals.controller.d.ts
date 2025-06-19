import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    createGoal(goal: Goal): {
        id: string;
    };
    getAllGoals(): Goal[];
    updateGoal(goal: Goal): {
        success: boolean;
    };
    deleteGoal(id: string): {
        success: boolean;
    };
}
