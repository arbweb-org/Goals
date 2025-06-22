import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { jwtVerify } from 'jose';

export const JWT_SECRET = 'KKFRUU6ruToCXHJvo9GQfyikuiZTNkJz';
export const USER_ID = 'userId';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Session expired');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Session expired');
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (typeof payload.data !== 'string') {
            throw new UnauthorizedException('Session expired');
        }

        const data = payload.data;        
        request['userId'] = data;
        return true;
    }
}
