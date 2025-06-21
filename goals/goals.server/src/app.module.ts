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
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '06sL5U5h',
                database: 'goalsdb',
                entities: [User, Goal],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Goal]),
        TypeOrmModule.forFeature([User]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public/browser'),
        }),
        UsersModule,
        GoalsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}