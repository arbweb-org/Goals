import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
import { AuthGuard, USER_ID } from '../auth/auth.guard';

@Controller('api/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Get('public')
    async getPublicGoals(): Promise<Goal[]> {
        return await this.goalsService.findAll('0');
    }

    @UseGuards(AuthGuard)
    @Get('private')
    async getPrivateGoals(@Req() req): Promise<Goal[]> {
        const userId = req[USER_ID];
        return await this.goalsService.findAll(userId);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async createGoal(@Req() req, @Body() goal: Partial<Goal>): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        await this.goalsService.createGoal(userId, goal);
        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Put('update')
    async updateGoal(@Req() req, @Body() goal: Partial<Goal>): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        await this.goalsService.updateGoal(userId, goal);
        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Put('nest/:sourceId/:targetId')
    async nestGoal(@Req() req, @Param('sourceId') sourceId: string, @Param('targetId') targetId: string): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        await this.goalsService.nestGoal(userId, sourceId, targetId);
        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Put('reorder/:sourceId/:targetId')
    async reorderGoal(@Req() req, @Param('sourceId') sourceId: string, @Param('targetId') targetId: string): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        await this.goalsService.reorderGoal(userId, sourceId, targetId);
        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Put('setPublic/:id')
    async setGoalPublic(@Req() req, @Param('id') id: string): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        const goal = await this.goalsService.setPublic(userId, id);
        if (!goal) {
            throw new NotFoundException('Goal not found');
        }

        return { success: true };
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteGoal(@Req() req, @Param('id') id: string): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        await this.goalsService.deleteGoal(userId, id);
        return { success: true };
    }
}