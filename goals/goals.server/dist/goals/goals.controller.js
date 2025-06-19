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
exports.GoalsController = void 0;
const common_1 = require("@nestjs/common");
const goals_service_1 = require("./goals.service");
const goal_entity_1 = require("./goal.entity");
let GoalsController = class GoalsController {
    goalsService;
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    createGoal(goal) {
        const id = this.goalsService.createGoal(goal);
        return { id };
    }
    getAllGoals() {
        return this.goalsService.findAll();
    }
    updateGoal(goal) {
        const updated = this.goalsService.updateGoal(goal);
        if (!updated) {
            throw new common_1.NotFoundException('Goal not found');
        }
        return { success: true };
    }
    deleteGoal(id) {
        const deleted = this.goalsService.deleteGoal(id);
        if (!deleted) {
            throw new common_1.NotFoundException('Goal not found');
        }
        return { success: true };
    }
};
exports.GoalsController = GoalsController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goal_entity_1.Goal]),
    __metadata("design:returntype", Object)
], GoalsController.prototype, "createGoal", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], GoalsController.prototype, "getAllGoals", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goal_entity_1.Goal]),
    __metadata("design:returntype", Object)
], GoalsController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.Delete)('delete:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], GoalsController.prototype, "deleteGoal", null);
exports.GoalsController = GoalsController = __decorate([
    (0, common_1.Controller)('api/goals'),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
//# sourceMappingURL=goals.controller.js.map