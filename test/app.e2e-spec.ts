import * as pactum from 'pactum';
import { Sequelize } from 'sequelize-typescript';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { SignUpDto } from '../src/modules/auth/dto';
import { Session } from '../src/modules/session/session.entity';
import { User } from '../src/modules/user/user.entity';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let db: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(4004);

    db = app.get<Sequelize>('SEQUELIZE');

    await db.getRepository(User).truncate();
    await db.getRepository(Session).truncate();

    pactum.request.setBaseUrl('http://localhost:4004');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: SignUpDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    };

    describe('SignUp', () => {
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });

      it('Should throw error if body is empty', () => {
        return pactum.spec().post('/auth/sign-up').withBody({}).expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum.spec().post('/auth/sign-up').withBody(dto).expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });

      it('Should throw error if body is empty', () => {
        return pactum.spec().post('/auth/sign-in').withBody({}).expectStatus(400);
      });

      it('Should throw error if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ email: 'test@test.com', password: 'wrong' })
          .expectStatus(401);
      });

      it('Should throw error if email is wrong', () => {
        return pactum.spec().post('/auth/sign-in').withBody({ email: 'test@test', password: 'test' }).expectStatus(400);
      });

      it('Should throw error if email and password are wrong', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ email: 'test@test', password: 'wrong' })
          .expectStatus(400);
      });

      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'data.access');
      });
    });

    describe('User', () => {
      describe('GetMe', () => {
        it('Should return unauthorized', () => {
          return pactum.spec().get('/users/me').expectStatus(401);
        });

        it('Should get current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
            .expectStatus(200)
            .stores('userId', 'data.id');
        });
      });

      describe('Get user by id', () => {
        it('Should return unauthorized', () => {
          return pactum.spec().get('/users/1').expectStatus(401);
        });

        it('Should get user by id', () => {
          return pactum
            .spec()
            .get('/users/$S{userId}')
            .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
            .expectStatus(200);
        });

        it('Should throw error if user is not found', () => {
          return pactum
            .spec()
            .get('/users/999')
            .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
            .expectStatus(404);
        });
      });
    });
  });
});
