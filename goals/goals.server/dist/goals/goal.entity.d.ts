export declare class Goal {
    id: string;
    title: string;
    description: string | null;
    deadline: Date;
    isPublic: boolean;
    parentId: string | null;
    order: number;
    publicId: string | null;
    ownerId: string;
    createdAt: Date;
}
