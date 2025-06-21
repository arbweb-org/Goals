import { createHash } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    private passwordHash: string;

    set password(value: string) {
        this.passwordHash = this.hash(value);
    }

    validatePassword(password: string): boolean {
        return this.passwordHash === this.hash(password);
    }

    private hash(data: string) {
        return createHash('sha256').update(data).digest('hex');
    }
}