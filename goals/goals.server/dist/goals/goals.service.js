"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_entity_1 = require("./goal.entity");
let GoalsService = class GoalsService {
    goalRepo;
    constructor(goalRepo) {
        this.goalRepo = goalRepo;
    }
    async findAll(isPublic) {
        return await this.goalRepo.find({ where: { isPublic: isPublic } });
    }
    async createGoal(goalData) {
        goalData.parentId = '0';
        const lastGoal = await this.goalRepo.findOne({
            where: { parentId: goalData.parentId },
            order: { order: 'DESC' },
        });
        goalData.order = lastGoal ? lastGoal.order + 1 : 0;
        const goal = this.goalRepo.create(goalData);
        await this.goalRepo.save(goal);
        return true;
    }
    async updateGoal(goalData) {
        const existingGoal = await this.goalRepo.findOne({ where: { id: goalData.id } });
        if (!existingGoal) {
            return false;
        }
        if (existingGoal.isPublic) {
            return false;
        }
        existingGoal.title = goalData.title ?? '';
        existingGoal.description = goalData.description ?? '';
        existingGoal.deadline = goalData.deadline ?? new Date();
        await this.goalRepo.save(existingGoal);
        return true;
    }
    async nestGoal(sourceId, targetId) {
        if (sourceId === targetId) {
            return false;
        }
        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });
        if (!sourceGoal || !targetGoal) {
            return false;
        }
        if (sourceGoal.isPublic || targetGoal.isPublic) {
            return false;
        }
        if (sourceGoal.parentId === targetId) {
            return false;
        }
        if (targetGoal.parentId === sourceId) {
            return false;
        }
        if (targetGoal.parentId !== '0') {
            const parentGoal = await this.goalRepo.findOne({ where: { id: targetGoal.parentId } });
            if (parentGoal && parentGoal.parentId !== '0') {
                return false;
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
    async reorderGoal(sourceId, targetId) {
        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });
        if (!sourceGoal || !targetGoal) {
            return false;
        }
        if (sourceGoal.isPublic || targetGoal.isPublic) {
            return false;
        }
        if (sourceGoal.id === targetGoal.id) {
            return false;
        }
        if (sourceGoal.parentId !== targetGoal.parentId) {
            return false;
        }
        if (sourceGoal.order === targetGoal.order + 1) {
            return false;
        }
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
    async setPublic(id) {
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.isPublic) {
            return true;
        }
        return await this.setPublicTree(id);
    }
    async setPublicTree(id) {
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
    async deleteGoal(id) {
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.isPublic) {
            return false;
        }
        return await this.deleteGoalTree(id);
    }
    async deleteGoalTree(id) {
        const children = await this.goalRepo.find({ where: { parentId: id } });
        if (children.length !== 0) {
            for (const goal of children) {
                await this.deleteGoalTree(goal.id);
            }
        }
        await this.goalRepo.delete(id);
        return true;
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoalsService);
//# sourceMappingURL=goals.service.js.map