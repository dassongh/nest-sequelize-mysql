import { User } from './user.entity';

import { Repositories } from '../../common/constants';

export const userProviders = [
  {
    provide: Repositories.USER,
    useValue: User,
  },
];
