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
    async findByParent(parentId) {
        return await this.goalRepo.find({ where: { parentId: parentId } });
    }
    async findByUser(userId, isPublic) {
        return await this.goalRepo.find({ where: { ownerId: userId, isPublic: isPublic } });
    }
    async createGoal(userId, goalData) {
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
    async updateGoal(userId, goalData) {
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
    async nestGoal(userId, sourceId, targetId) {
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
        let targetLevel = 0;
        let sourceHeight = 0;
        if (['0', '1'].includes(targetGoal.parentId)) {
        }
        else {
            const targetParent = await this.goalRepo.findOne({ where: { id: targetGoal.parentId } });
            if (targetParent && ['0', '1'].includes(targetParent.parentId)) {
                targetLevel = 1;
            }
            else {
                return false;
            }
        }
        const sourceChildren = await this.goalRepo.find({ where: { parentId: sourceGoal.id } });
        if (sourceChildren.length === 0) {
        }
        else {
            sourceHeight = 1;
        }
        for (const child of sourceChildren) {
            const grandChildren = await this.goalRepo.find({ where: { parentId: child.id } });
            if (grandChildren.length > 0) {
                return false;
            }
        }
        if (targetLevel + sourceHeight + 1 > 2) {
            return false;
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
    async reorderGoal(userId, sourceId, targetId) {
        const sourceGoal = await this.goalRepo.findOne({ where: { id: sourceId } });
        const targetGoal = await this.goalRepo.findOne({ where: { id: targetId } });
        if (!sourceGoal || !targetGoal) {
            return false;
        }
        if (sourceGoal.ownerId !== userId || targetGoal.ownerId !== userId) {
            return false;
        }
        if (sourceGoal.isPublic) {
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
    async togglePublic(userId, id) {
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
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
        let updatables = [];
        const res = await this.toggleRecursive(goal, updatables);
        await this.goalRepo.save(updatables);
        return res;
    }
    async toggleRecursive(goal, updatables) {
        const children = await this.goalRepo.find({ where: { parentId: goal.id } });
        if (children.length !== 0) {
            for (const child of children) {
                await this.toggleRecursive(child, updatables);
            }
        }
        goal.isPublic = !goal.isPublic;
        if (goal.isPublic) {
            goal.order = 0;
        }
        updatables.push(goal);
        return true;
    }
    async deleteGoal(userId, id) {
        const goal = await this.goalRepo.findOne({ where: { id: id } });
        if (!goal) {
            return false;
        }
        if (goal.ownerId !== userId) {
            return false;
        }
        let deletables = [];
        const res = await this.deleteRecursive(goal, deletables);
        await this.goalRepo.remove(deletables);
        return res;
    }
    async deleteRecursive(goal, deletables) {
        const children = await this.goalRepo.find({ where: { parentId: goal.id } });
        if (children.length !== 0) {
            for (const child of children) {
                await this.deleteRecursive(child, deletables);
            }
        }
        deletables.push(goal);
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