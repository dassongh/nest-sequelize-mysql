import { Module } from '@nestjs/common';

import { sessionProviders } from './session.providers';
import { SessionService } from './session.service';

import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SessionService, ...sessionProviders],
  exports: [SessionService],
})
export class SessionModule {}
