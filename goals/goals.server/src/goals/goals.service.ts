import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';

@Injectable()
export class GoalsService {
    constructor(@InjectRepository(Goal) private goalRepo: Repository<Goal>) { }

    async findByParent(parentId: string): Promise<Goal[]> {
        return await this.goalRepo.find({ where: { parentId: parentId } });
    }

    async findByUser(userId: string, isPublic: boolean): Promise<Goal[]> {
        return await this.goalRepo.find({ where: { ownerId: userId, isPublic: isPublic } });
    }

    async createGoal(userId: string, goalData: Partial<Goal>): Promise<boolean> {
        const parentId = goalData.isPublic ? '1' : '0';
        const lastGoal = await this.goalRepo.findOne({
            where: { parentId: parentId },
            order: { order: 'DESC' },
        });

        goalData.parentId = parentId;
        goalData.order = lastGoal ? lastGoal.order + 1 : 0;
        goalData.ownerId = userId;

        const goal = this.goalRepo.create(goalData);
        await this.goalRepo.save(goal);
        return true;
    }

    async updateGoal(userId: string, goalData: Partial<Goal>): Promise<boolean> {
        const existingGoal = await this.goalRepo.findOne({ where: { id: goalData.id } });

        if (!existingGoal) {
            return false;
        }
        if (existingGoal.ownerId !== userId) {
            return false;
        }

        existingGoal.title = goalData.title ?? '';
        existingGoal.description = goalData.description ?? '';
        existingGoal.deadline = goalData.deadline ?? (new Date()).toISOString();
               
        await this.goalRepo.save(existingGoal);
        return true;
    }

    async nestGoal(userId: string, sourceId: string, targetId: string): Promise<boolean> {
        if (sourceId === targetId) {
            return false;
        }

        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });

        if (!sourceGoal || !targetGoal) {
            return false;
        }
        if (sourceGoal.ownerId !== userId || targetGoal.ownerId !== userId) {
            return false;
        }
        if (sourceGoal.parentId === targetId) {            
            return false;
        }
        if (targetGoal.parentId === sourceId) {
            return false;
        }
         
        // Restricting total depth to 2 levels
        let targetLevel = 0;
        let sourceHeight = 0;

        // Calculate target depth
        if (['0', '1'].includes(targetGoal.parentId)) {
            // Target depth = 0 (root)
        }
        else {
            const targetParent = await this.goalRepo.findOne({ where: { id: targetGoal.parentId } });
            if (targetParent && ['0', '1'].includes(targetParent.parentId)) { 
                targetLevel = 1; // Target depth = 1                
            }
            else {
                return false; // Target depth = 2
            }
        }

        // Calculate source height
        const sourceChildren = await this.goalRepo.find({ where: { parentId: sourceGoal.id } });
        if (sourceChildren.length === 0) {
            // Source height = 0
        }
        else {
            sourceHeight = 1; // Source height may be 1 or 2
        }
        for (const child of sourceChildren) {
            const grandChildren = await this.goalRepo.find({ where: { parentId: child.id } });
            if (grandChildren.length > 0) {
                return false; // Source height = 2
            }
        }

        // Calculate total new height
        if (targetLevel + sourceHeight + 1 > 2) {
            return false; // Total new height exceeds 2
        }

        const lastGoal = await this.goalRepo.findOne({
            where: { parentId: targetId },
            order: { order: 'DESC' },
        });

        sourceGoal.order = lastGoal ? lastGoal.order + 1 : 0;
        sourceGoal.parentId = targetId;
        await this.goalRepo.save(sourceGoal);
        return true;
    }

    async reorderGoal(userId: string, sourceId: string, targetId: string): Promise<boolean> {
        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });

        if (!sourceGoal || !targetGoal) { return false; }
        if (sourceGoal.ownerId !== userId || targetGoal.ownerId !== userId) { return false; }
        if (sourceGoal.isPublic) { return false; }
        if (sourceGoal.id === targetGoal.id) { return false; }
        if (sourceGoal.parentId !== targetGoal.parentId) { return false; }
        if (sourceGoal.order === targetGoal.order + 1) { return false; }

        let siblings = await this.goalRepo.find({
            where: { parentId: targetGoal.parentId },
            order: { order: 'ASC' }
        });

        siblings = siblings.filter(g => g.id !== sourceGoal.id);
        const targetIndex = siblings.findIndex(g => g.id === targetGoal.id);
        siblings.splice(targetIndex + 1, 0, sourceGoal);

        for (let i = 0; i < siblings.length; i++) {
            siblings[i].order = i;
        }

        await this.goalRepo.save(siblings);
        return true;
    }

    async togglePublic(userId: string, id: string): Promise<boolean> {
        // Get the goal by Id
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        // Check if the goal exists
        if (!goal) {
            return false;
        }
        // Check if the user is the owner of the goal
        if (goal.ownerId !== userId) {
            return false;
        }

        goal.parentId = !goal.isPublic ? '1' : '0';
        if (goal.isPublic) {
            const lastGoal = await this.goalRepo.findOne({
                where: { parentId: goal.parentId },
                order: { order: 'DESC' },
            });
            goal.order = lastGoal ? lastGoal.order + 1 : 0;
        }

        let updatables: Goal[] = [];
        const res = await this.toggleRecursive(goal, updatables);
        await this.goalRepo.save(updatables);
        return res;
    }

    async toggleRecursive(goal: Goal, updatables: Goal[]): Promise<boolean> {
        const children = await this.goalRepo.find({ where: { parentId: goal.id } });
        if (children.length !== 0) {
            for (const child of children) {
                await this.toggleRecursive(child, updatables);
            }
        }

        goal.isPublic = !goal.isPublic;
        if (goal.isPublic) { goal.order = 0; }
        updatables.push(goal);
        return true;
    }

    async deleteGoal(userId: string, id: string): Promise<boolean> { 
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.ownerId !== userId) {
            return false;
        }

        let deletables: Goal[] = [];
        const res = await this.deleteRecursive(goal, deletables);
        await this.goalRepo.remove(deletables);
        return res;
    }

    async deleteRecursive(goal: Goal, deletables: Goal[]): Promise<boolean> {
        const children = await this.goalRepo.find({ where: { parentId: goal.id } });
        if (children.length !== 0) {
            for (const child of children) {
                await this.deleteRecursive(child, deletables);
            }
        }

        deletables.push(goal)
        return true;
    }
}