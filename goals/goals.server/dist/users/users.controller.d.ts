import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(user: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
    register(user: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
}
