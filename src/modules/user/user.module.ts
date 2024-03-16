import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
