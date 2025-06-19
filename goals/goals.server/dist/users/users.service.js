"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    users = [];
    createUser(email, password) {
        if (this.users.find(user => user.email === email)) {
            return undefined;
        }
        const user = new user_entity_1.User();
        user.id = (this.users.length + 1).toString();
        user.email = email;
        user.password = password;
        this.users.push(user);
        return user.id;
    }
    findUserById(id) {
        return this.users.find(user => user.id === id);
    }
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map