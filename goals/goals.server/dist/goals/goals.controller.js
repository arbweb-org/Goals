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
const auth_guard_1 = require("../auth/auth.guard");
let GoalsController = class GoalsController {
    goalsService;
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    async getPublicGoals(parentId) {
        return await this.goalsService.findByParent(parentId);
    }
    async getDashboard(req, isPublic) {
        const userId = req[auth_guard_1.USER_ID];
        return await this.goalsService.findByUser(userId, isPublic);
    }
    async createGoal(req, goal) {
        const userId = req[auth_guard_1.USER_ID];
        await this.goalsService.createGoal(userId, goal);
        return { success: true };
    }
    async updateGoal(req, goal) {
        const userId = req[auth_guard_1.USER_ID];
        await this.goalsService.updateGoal(userId, goal);
        return { success: true };
    }
    async nestGoal(req, sourceId, targetId) {
        const userId = req[auth_guard_1.USER_ID];
        await this.goalsService.nestGoal(userId, sourceId, targetId);
        return { success: true };
    }
    async reorderGoal(req, sourceId, targetId) {
        const userId = req[auth_guard_1.USER_ID];
        await this.goalsService.reorderGoal(userId, sourceId, targetId);
        return { success: true };
    }
    async togglePublic(req, id) {
        const userId = req[auth_guard_1.USER_ID];
        const goal = await this.goalsService.togglePublic(userId, id);
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        return { success: true };
    }
    async deleteGoal(req, id) {
        const userId = req[auth_guard_1.USER_ID];
        await this.goalsService.deleteGoal(userId, id);
        return { success: true };
    }
};
exports.GoalsController = GoalsController;
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "getPublicGoals", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('isPublic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "createGoal", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('nest/:sourceId/:targetId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sourceId')),
    __param(2, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "nestGoal", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('reorder/:sourceId/:targetId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sourceId')),
    __param(2, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "reorderGoal", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('togglePublic/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "togglePublic", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "deleteGoal", null);
exports.GoalsController = GoalsController = __decorate([
    (0, common_1.Controller)('api/goals'),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
//# sourceMappingURL=goals.controller.js.map