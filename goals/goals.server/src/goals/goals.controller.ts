import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';

@Controller('api/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Get('public')
    async getPublicGoals(): Promise<Goal[]> {
        return await this.goalsService.findAll(true);
    }

    @Get('private')
    async getPrivateGoals(): Promise<Goal[]> {
        return await this.goalsService.findAll(false);
    }

    @Post('create')
    async createGoal(@Body() goal: Partial<Goal>): Promise<{ success: boolean }> {
        await this.goalsService.createGoal(goal);
        return { success: true };
    }

    @Put('update')
    async updateGoal(@Body() goal: Partial<Goal>): Promise<{ success: boolean }> {
        await this.goalsService.updateGoal(goal);
        return { success: true };
    }

    @Put('nest/:sourceId/:targetId')
    async nestGoal(@Param('sourceId') sourceId: string, @Param('targetId') targetId: string): Promise<{ success: boolean }> {
        await this.goalsService.nestGoal(sourceId, targetId);
        return { success: true };
    }

    @Put('reorder/:sourceId/:targetId')
    async reorderGoal(@Param('sourceId') sourceId: string, @Param('targetId') targetId: string): Promise<{ success: boolean }> {
        await this.goalsService.reorderGoal(sourceId, targetId);
        return { success: true };
    }

    @Put('setPublic/:id')
    async setGoalPublic(@Param('id') id: string): Promise<{ success: boolean }> {
        const goal = await this.goalsService.setPublic(id);
        if (!goal) {
            throw new NotFoundException('Goal not found');
        }

        return { success: true };
    }

    @Delete('delete/:id')
    async deleteGoal(@Param('id') id: string): Promise<{ success: boolean }> {
        await this.goalsService.deleteGoal(id);
        return { success: true };
    }
}