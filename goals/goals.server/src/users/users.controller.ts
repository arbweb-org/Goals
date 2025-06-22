import { Controller, Post, Body, ConflictException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignJWT } from 'jose';
import { JWT_SECRET } from '../auth/auth.guard';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('login')
    async login(@Body() userData: { email: string, password: string }): Promise<{ success: boolean, token: string }> {
        if (!userData.email || !userData.password) {
            throw new UnauthorizedException('Email and password are required!');
        }

        const user = await this.usersService.findUserByEmail(userData.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials!');
        }
        if (!user.validatePassword(userData.password)) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        // Generate a new token for the user
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({ data: user.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret);

        return { success: true, token };
    }

    @Post('register')
    async register(@Body() userData: { email: string, password: string }): Promise<{ success: boolean }> {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email || !emailRegex.test(userData.email)) {
            throw new UnprocessableEntityException('Invalid email format');
        }
        // Validate password
        if (!userData.password || userData.password.length < 6) {
            throw new UnprocessableEntityException('Password must be at least 6 characters long');
        }

        const res = await this.usersService.createUser(userData.email, userData.password);
        if (!res) {
            throw new ConflictException('User already exists');
        }

        return { success: true };
    }
}