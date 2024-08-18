import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { Book } from './../src/books/entities/Book.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const isbn = "978-0-452-28423-4";
  const bookRequestBody = {
    "isbn": isbn,
    "title": "1984",
    "author": "George Orwell"
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(Book).execute();
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
        "isbn": isbn,
        "title": "1984",
        "author": "George Orwell",
        "status": "AVAILABLE"
      })
      .then(() => {
        return request(app.getHttpServer())
          .get('/books/' + isbn)
          .expect(200)
          .expect(
            {
              "isbn": isbn,
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          );
      })
  });

  it('get book by isbn returns not found', () => {
    return request(app.getHttpServer())
      .get('/books/' + isbn)
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
          .get('/books/' + isbn)
          .expect(200)
          .expect(
            {
              "isbn": isbn,
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          )
          .then(() => {
            return request(app.getHttpServer())
              .patch('/books/' + isbn)
              .send(updatedBookRequestBody)
              .expect(200)
              .expect(
                {
                  "isbn": isbn,
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
          .get('/books/' + isbn)
          .expect(200)
          .expect(
            {
              "isbn": isbn,
              "title": "1984",
              "author": "George Orwell",
              "status": "AVAILABLE"
            }
          )
          .then(() => {
            return request(app.getHttpServer())
              .delete('/books/' + isbn)
              .expect(200)
              .expect(
                {
                  "isbn": isbn,
                  "title": "1984",
                  "author": "George Orwell",
                  "status": "AVAILABLE"
                }
              )
              .then(() => {
                return request(app.getHttpServer())
                  .get('/books/' + isbn)
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
        "isbn": isbn,
        "title": "1984",
        "author": "George Orwell",
        "status": "AVAILABLE"
      })
      .then(() => {
        return request(app.getHttpServer())
          .post('/books/' + isbn + '/transaction?action=CHECKOUT')
          .expect(201)
          .expect(
            {
              "isbn": isbn,
              "title": "1984",
              "author": "George Orwell",
              "status": "BOOKED"
            }
          );
      })
  });
});
