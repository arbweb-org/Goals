import { User } from './user.entity';
export declare class UsersService {
    private users;
    createUser(email: string, password: string): number;
    findUserById(id: number): User | undefined;
    findUserByEmail(email: string): User | undefined;
}
