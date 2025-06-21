import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

    async findUserById(id: string): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: { id: id } });
        if (!user) {
            return null; // User not found
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: { email: email } });
        if (!user) {
            return null; // User not found
        }

        return user;
    }

    async createUser(email: string, password: string): Promise<boolean> {
        if (await this.findUserByEmail(email)) {
            return false; // User already exists
        }

        const user = this.userRepo.create();
        user.email = email;
        user.password = password; // Password is hashed in the User entity's password setter

        await this.userRepo.save(user);   
        return true;
    }
}