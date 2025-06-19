import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string | null;

    @Column()
    deadline: Date;

    @Column({ default: false })
    isPublic: boolean;

    @Column({ nullable: true })
    parentId: string | null;

    @Column()
    order: number;

    @Column({ nullable: true })
    publicId: string | null;

    @Column()
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;
}