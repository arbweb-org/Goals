import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare const JWT_SECRET = "KKFRUU6ruToCXHJvo9GQfyikuiZTNkJz";
export declare const USER_ID = "userId";
export declare class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
