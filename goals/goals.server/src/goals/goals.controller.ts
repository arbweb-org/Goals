import { Controller, Query, Get, Post, Put, Delete, Body, Param, NotFoundException, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';
import { AuthGuard, USER_ID } from '../auth/auth.guard';

@Controller('api/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Get('public')
    async getPublicGoals(@Query('parentId') parentId: string): Promise<Goal[]> {
        return await this.goalsService.findByParent(parentId);
    }

    @UseGuards(AuthGuard)
    @Get('dashboard')
    async getDashboard(@Req() req, @Query('isPublic') isPublic: boolean): Promise<Goal[]> {
        const userId = req[USER_ID];
        return await this.goalsService.findByUser(userId, isPublic);
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
    @Put('togglePublic/:id')
    async togglePublic(@Req() req, @Param('id') id: string): Promise<{ success: boolean }> {
        const userId = req[USER_ID];
        const goal = await this.goalsService.togglePublic(userId, id);
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