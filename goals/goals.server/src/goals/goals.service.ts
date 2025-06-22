import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';

@Injectable()
export class GoalsService {
    constructor(@InjectRepository(Goal) private goalRepo: Repository<Goal>) { }

    async findAll(userId: string): Promise<Goal[]> {
        return await this.goalRepo.find({ where: { ownerId: userId } });
    }

    async createGoal(userId: string, goalData: Partial<Goal>): Promise<boolean> {
        // Last goal in level 1
        const lastGoal = await this.goalRepo.findOne({
            where: { parentId: '0' },
            order: { order: 'DESC' },
        });

        goalData.ownerId = userId;
        goalData.parentId = '0';
        goalData.order = lastGoal ? lastGoal.order + 1 : 0;
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
            return false; // User does not own this goal
        }
        if (existingGoal.isPublic) {
            return false; // Cannot update public goals
        }

        existingGoal.title = goalData.title ?? '';
        existingGoal.description = goalData.description ?? '';
        existingGoal.deadline = goalData.deadline ?? (new Date()).toISOString();
               
        await this.goalRepo.save(existingGoal);
        return true;
    }

    async nestGoal(userId: string, sourceId: string, targetId: string): Promise<boolean> {
        if (sourceId === targetId) {
            return false; // Cannot nest a goal under itself
        }

        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });

        if (!sourceGoal || !targetGoal) {
            return false;
        }
        if (sourceGoal.ownerId !== userId || targetGoal.ownerId !== userId) {
            return false; // User does not own one of the goals
        }
        if (sourceGoal.isPublic || targetGoal.isPublic) {
            return false; // Cannot nest public goals
        }
        if (sourceGoal.parentId === targetId) {            
            return false; // Already nested under the target
        }
        if (targetGoal.parentId === sourceId) {
            return false; // Cannot nest a goal under its child.
        }
        if (targetGoal.parentId !== '0') { // Target has a parent
            const parentGoal = await this.goalRepo.findOne({ where: { id: targetGoal.parentId } });
            if (parentGoal && parentGoal.parentId !== '0') { // Target has a grandparent
                return false; // Cannot nest more than 2 levels deep
            }
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
        if (sourceGoal.isPublic || targetGoal.isPublic) { return false; }
        if (sourceGoal.id === targetGoal.id) { return false; }
        if (sourceGoal.parentId !== targetGoal.parentId) { return false; }
        if (sourceGoal.order === targetGoal.order + 1) { return false; }

        // Load all sibling goals
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

    async setPublic(userId: string, id: string): Promise<boolean> {
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.ownerId !== userId) {
            return false; // User does not own this goal
        }
        if (goal.isPublic) {
            return true;
        }

        return await this.setPublicTree(id);
    }

    async setPublicTree(id: string): Promise<boolean> {
        const children = await this.goalRepo.find({ where: { parentId: id } });
        if (children.length !== 0) {
            for (const goal of children) {
                await this.setPublicTree(goal.id);
            }
        }

        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        goal.isPublic = true;
        goal.ownerId = '0';
        goal.parentId = '1';
        goal.order = 0;

        await this.goalRepo.save(goal);
        return true;
    }

    // To be surrounded with transaction
    async deleteGoal(userId: string, id: string): Promise<boolean> { 
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.ownerId !== userId) {
            return false; // User does not own this goal
        }
        if (goal.isPublic) {
            return false; // Cannot delete public goals
        }
        return await this.deleteGoalTree(id);
    }

    async deleteGoalTree(id: string): Promise<boolean> {
        const children = await this.goalRepo.find({ where: { parentId: id } });
        if (children.length !== 0) {
            for (const goal of children) {
                await this.deleteGoalTree(goal.id);
            }
        }

        await this.goalRepo.delete(id);
        return true;
    }
}