import { Controller, Post, Body, ConflictException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('login')
    async login(@Body() user: { email: string, password: string }): Promise<{ success: boolean }> {
        if (!user.email || !user.password) {
            throw new UnauthorizedException('Email and password are required!');
        }

        const foundUser = await this.usersService.findUserByEmail(user.email);
        if (!foundUser) {
            throw new UnauthorizedException('Invalid credentials!');
        }
        if (!foundUser.validatePassword(user.password)) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        return { success: true };
    }

    @Post('register')
    async register(@Body() user: { email: string, password: string }): Promise<{ success: boolean }> {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email || !emailRegex.test(user.email)) {
            throw new UnprocessableEntityException('Invalid email format');
        }
        // Validate password
        if (!user.password || user.password.length < 6) {
            throw new UnprocessableEntityException('Password must be at least 6 characters long');
        }

        const res = await this.usersService.createUser(user.email, user.password);
        if (!res) {
            throw new ConflictException('User already exists');
        }

        return { success: true };
    }
}