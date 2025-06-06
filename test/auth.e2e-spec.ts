import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface UserResponse {
  id: number;
  email: string;
}

describe('Authentication system (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const testEmail = 'test56@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testEmail })
      .expect(201);

    const user = res.body as UserResponse;
    expect(user.id).toBeDefined();
    expect(user.email).toEqual(testEmail);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const testEmail = 'test57@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testEmail })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    if (!cookie || !cookie.length) {
      throw new Error('No cookie returned from signup');
    }

    const response = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    const user = response.body as UserResponse;
    expect(user.email).toEqual(testEmail);
  });
});
