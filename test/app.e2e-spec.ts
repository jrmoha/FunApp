import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let rand_id: string;
  const rand_email = `test${new Date().getTime()}@test.com`;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('/POST signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send({
        name: 'test',
        email: rand_email,
        latitude: 30.0444,
        longitude: 31.2357,
      })
      .expect(201);
    rand_id = response.body.id;
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'test',
      email: rand_email,
      city: 'Cairo',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
  it('/GET profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/' + rand_id)
      .expect(200);

    expect(response.body).toEqual({
      name: 'test',
      email: rand_email,
      city: 'Cairo',
    });
  });
});
