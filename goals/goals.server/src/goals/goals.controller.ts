import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './goal.entity';

@Controller('api/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Post('create')
    createGoal(@Body() goal: Goal): { id: string } {
        const id = this.goalsService.createGoal(goal);
        return { id };
    }

    @Get('list')
    getAllGoals(): Goal[] {
        return this.goalsService.findAll();
    }

    @Put('update')
    updateGoal(@Body() goal: Goal): { success: boolean } {
        const updated = this.goalsService.updateGoal(goal);
        if (!updated) {
            throw new NotFoundException('Goal not found');
        }
        return { success: true };
    }

    @Delete('delete:id')
    deleteGoal(@Param('id') id: string): { success: boolean } {
        const deleted = this.goalsService.deleteGoal(id);
        if (!deleted) {
            throw new NotFoundException('Goal not found');
        }
        return { success: true };
    }
}