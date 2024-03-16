import { Sequelize } from 'sequelize-typescript';

import { ConfigService } from '@nestjs/config';

import { Session } from '../session/session.entity';
import { User } from '../user/user.entity';

import { EnvVariables } from '../../common/constants';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: config.get<string>(EnvVariables.MYSQL_HOST),
        port: config.get<number>(EnvVariables.MYSQL_PORT),
        username: config.get<string>(EnvVariables.MYSQL_USER),
        password: config.get<string>(EnvVariables.MYSQL_PASSWORD),
        database: config.get<string>(EnvVariables.MYSQL_DB),
      });
      sequelize.addModels([User, Session]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
