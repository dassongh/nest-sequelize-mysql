import { Inject, Injectable } from '@nestjs/common';

import { CreateSessionDto } from './dto';
import { Session } from './session.entity';

import { Repositories } from '../../common/constants';

@Injectable()
export class SessionService {
  constructor(@Inject(Repositories.SESSION) private sessionRepository: typeof Session) {}

  public createOrUpdate(dto: CreateSessionDto) {
    return this.sessionRepository.upsert({ ...dto });
  }

  public get(userId: string, clientId: string) {
    return this.sessionRepository.findOne({ where: { userId, clientId }, raw: true });
  }

  public delete(userId: string, clientId: string) {
    return this.sessionRepository.destroy({ where: { userId, clientId } });
  }
}
