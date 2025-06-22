import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(userData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        token: string;
    }>;
    register(userData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
}
