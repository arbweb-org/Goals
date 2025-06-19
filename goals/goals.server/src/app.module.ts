import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
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