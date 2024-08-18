import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const bookRequestBody = {
    "isbn": randomUUID,
    "title": "1984",
    "author": "George Orwell"
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });


  it('get book by isbn', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send(bookRequestBody)
      .expect(201)
      .expect({
        "isbn": "978-0-452-28423-4",
        "title": "1984",
        "author": "George Orwell",
        "status": "AVAILABLE"
      })
      .then(() => {
        return request(app.getHttpServer())
          .get('/books/978-0-452-28423-4')
          .expect(200)
          .expect(
            {
              "isbn": "978-0-452-28423-4",
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          );
      })
  });

  it('get book by isbn returns not found', () => {
    return request(app.getHttpServer())
      .get('/books/978-0-452-28423-4')
      .expect(404)
      .expect({ "message": "Book Not Found", "error": "Not Found", "statusCode": 404 })
  });

  it('update book', () => {
    const updatedBookRequestBody = {
      "title": "Updated Title",
      "author": "Updated Author"
    };

    return request(app.getHttpServer())
      .post('/books')
      .send(bookRequestBody)
      .expect(201)
      .then(() => {
        return request(app.getHttpServer())
          .get('/books/978-0-452-28423-4')
          .expect(200)
          .expect(
            {
              "isbn": "978-0-452-28423-4",
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          )
          .then(() => {
            return request(app.getHttpServer())
              .patch('/books/978-0-452-28423-4')
              .send(updatedBookRequestBody)
              .expect(200)
              .expect(
                {
                  "isbn": "978-0-452-28423-4",
                  "title": "Updated Title",
                  "author": "Updated Author",
                  "status": "AVAILABLE"
                }
              )
          })
      })
  })

  it('delete book', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send(bookRequestBody)
      .expect(201)
      .then(() => {
        return request(app.getHttpServer())
          .get('/books/978-0-452-28423-4')
          .expect(200)
          .expect(
            {
              "isbn": "978-0-452-28423-4",
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          )
          .then(() => {
            return request(app.getHttpServer())
              .delete('/books/978-0-452-28423-4')
              .expect(200)
              .expect(
                {
                  "isbn": "978-0-452-28423-4",
                  "title": "1984",
                  "author": "George Orwell",
                  "status": "AVAILABLE"
                }
              )
              .then(() => {
                return request(app.getHttpServer())
                  .get('/books/978-0-452-28423-4')
                  .expect(404)
                  .expect({ "message": "Book Not Found", "error": "Not Found", "statusCode": 404 })
              })
          })
      })
  })

  it('checkout book', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send(bookRequestBody)
      .expect(201)
      .expect({
        "isbn": "978-0-452-28423-4",
        "title": "1984",
        "author": "George Orwell",
        "status": "AVAILABLE"
      })
      .then(() => {
        return request(app.getHttpServer())
          .post('/books/978-0-452-28423-4/transaction?action=CHECKOUT')
          .expect(201)
          .expect(
            {
              "isbn": "978-0-452-28423-4",
              "title": "1984",
              "author": "George Orwell",
              "status": "BOOKED"
            }
          );
      })
  });
});
