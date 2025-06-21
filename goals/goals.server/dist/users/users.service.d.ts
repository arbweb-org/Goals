import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    createUser(email: string, password: string): Promise<boolean>;
}
