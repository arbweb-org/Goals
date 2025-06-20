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
    deadline: Date;

    @Column({ default: false })
    isPublic: boolean;

    @Column({ default: '0' })
    parentId: string;

    @Column({ default: 0 })
    order: number;

    @Column({ default: '' })
    publicId: string;

    @Column({ default: '' })
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;
}