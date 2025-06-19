import { User } from './user.entity';
export declare class UsersService {
    private users;
    createUser(email: string, password: string): string | undefined;
    findUserById(id: string): User | undefined;
    findUserByEmail(email: string): User | undefined;
}
