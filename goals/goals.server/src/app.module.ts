import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Goal } from './goals/goal.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [User, Goal],
                synchronize: true, // Set to false in production!
            }),
        }),

        TypeOrmModule.forFeature([Goal]),
        TypeOrmModule.forFeature([User]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public/browser')
        }),
        UsersModule,
        GoalsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }