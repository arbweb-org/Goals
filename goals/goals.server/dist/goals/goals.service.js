"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
let GoalsService = class GoalsService {
    goals = [];
    createGoal(goal) {
        goal.id = Math.random().toString(36).substring(2, 15);
        goal.order = this.goals.length + 1;
        this.goals.push(goal);
        return goal.id;
    }
    findAll() {
        const myGoal = {
            id: '1',
            title: 'Sample Goal',
            description: null,
            deadline: new Date('2026-12-31'),
            isPublic: true,
            parentId: null,
            order: 1,
            publicId: null,
            ownerId: 'ownerGuid',
            createdAt: new Date(),
        };
        this.goals.push(myGoal);
        return this.goals;
    }
    updateGoal(goal) {
        const existingGoal = this.goals.find(g => g.id === goal.id);
        if (!existingGoal) {
            return false;
        }
        existingGoal.order = goal.order;
        existingGoal.title = goal.title;
        existingGoal.description = goal.description;
        return true;
    }
    deleteGoal(id) {
        const index = this.goals.findIndex(g => g.id === id);
        if (index === -1) {
            return false;
        }
        this.goals.splice(index, 1);
        return true;
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)()
], GoalsService);
//# sourceMappingURL=goals.service.js.map