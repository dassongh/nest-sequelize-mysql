import { Session } from './session.entity';

import { Repositories } from '../../common/constants';

export const sessionProviders = [
  {
    provide: Repositories.SESSION,
    useValue: Session,
  },
];
