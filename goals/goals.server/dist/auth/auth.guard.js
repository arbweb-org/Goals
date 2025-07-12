"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.USER_ID = void 0;
const common_1 = require("@nestjs/common");
const jose_1 = require("jose");
exports.USER_ID = 'userId';
let AuthGuard = class AuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!request.path.startsWith('/api')) {
            return true;
        }
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, secret);
            if (typeof payload.data !== 'string') {
                throw new common_1.UnauthorizedException('Session expired');
            }
            const data = payload.data;
            request['userId'] = data;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Session expired');
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)()
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map