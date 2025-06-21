export declare class User {
    id: string;
    email: string;
    private passwordHash;
    set password(value: string);
    validatePassword(password: string): boolean;
    private hash;
}
