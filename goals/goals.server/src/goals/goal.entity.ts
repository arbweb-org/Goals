import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    deadline: string;

    @Column()
    isPublic: boolean;

    @Column()
    parentId: string;

    @Column()
    order: number;

    @Column({ default: '' })
    publicId: string;

    @Column()
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;
}