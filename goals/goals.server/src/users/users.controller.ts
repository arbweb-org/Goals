import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    register(@Body() body: { email: string; password: string }): string {
        const id = this.usersService.createUser(body.email, body.password);

        if (!id) {
            throw new ConflictException('User already exists');
        }

        return `User registered successfully with ID: ${id}`;
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }): string {
        const user = this.usersService.findUserByEmail(body.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        if (user.password !== body.password) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        return 'User logged in successfully!';
    }
}