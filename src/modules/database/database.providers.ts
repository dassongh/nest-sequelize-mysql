import { Sequelize } from 'sequelize-typescript';

import { ConfigService } from '@nestjs/config';

import { Session } from '../session/session.entity';
import { User } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: config.get<number>('MYSQL_PORT'),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DB'),
      });
      sequelize.addModels([User, Session]);
      try {
        await sequelize.sync();
      } catch (error) {
        console.error(error);
      }
      return sequelize;
    },
  },
];
