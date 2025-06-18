import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    register(@Body() body: { email: string; password: string }): string {
        const id = this.usersService.createUser(body.email, body.password);

        if (id === -1) {
            return 'User already exists!';
        }

        return `User registered successfully with ID: ${id}`;
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }): string {
        const user = this.usersService.findUserByEmail(body.email);

        // if user undefined
        if (!user) {
            return 'Invalid credentials!';
        }

        if (user.password !== body.password) {
            return 'Invalid credentials!';
        }

        return 'User logged in successfully!';
    }
}