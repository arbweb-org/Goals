import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [];

    // To be surrounded by a transaction
    createUser(email: string, password: string): string | undefined {
        if (this.users.find(user => user.email === email)) {
            return undefined;
        }

        const user = new User();
        user.id = (this.users.length + 1).toString();
        user.email = email;
        user.password = password;

        this.users.push(user);
        return user.id;
    }

    findUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    findUserByEmail(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }
}