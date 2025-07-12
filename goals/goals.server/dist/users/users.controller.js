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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jose_1 = require("jose");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async login(userData) {
        if (!userData.email || !userData.password) {
            throw new common_1.UnauthorizedException('Email and password are required!');
        }
        const user = await this.usersService.findUserByEmail(userData.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials!');
        }
        if (!user.validatePassword(userData.password)) {
            throw new common_1.UnauthorizedException('Invalid credentials!');
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose_1.SignJWT({ data: user.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret);
        return { success: true, token };
    }
    async register(userData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email || !emailRegex.test(userData.email)) {
            throw new common_1.UnprocessableEntityException('Invalid email format');
        }
        if (!userData.password || userData.password.length < 6) {
            throw new common_1.UnprocessableEntityException('Password must be at least 6 characters long');
        }
        const res = await this.usersService.createUser(userData.email, userData.password);
        if (!res) {
            throw new common_1.ConflictException('User already exists');
        }
        return { success: true };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map