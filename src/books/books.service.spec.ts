import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './entities/Book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookStatus } from './enum/book-status';
import { NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { randomUUID } from 'crypto';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const books = [
    {
      "isbn": "978-1-60309-511-2",
      "title": "Doughnuts and Doom",
      "author": "Balazs Lorinczi",
      "status": "AVAILABLE"
    },
    {
      "isbn": "978-0-7432-7356-0",
      "title": "The Da Vinci Code",
      "author": "Dan Brown",
      "status": "BOOKED"
    },
    {
      "isbn": "978-0-399-16227-7",
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "status": "AVAILABLE"
    },
    {
      "isbn": "978-1-250-08375-2",
      "title": "The Midnight Library",
      "author": "Matt Haig",
      "status": "BOOKED"
    },
  ]

  const mockBookRepository = {
    find: jest.fn().mockResolvedValue(books),
    findBy: jest.fn().mockImplementation(({ status }) =>
      Promise.resolve(books.filter(book => book.status === status))
    ),
    findOneBy: jest.fn().mockImplementation(({ isbn }) =>
      books.find(book => book.isbn === isbn) || null
    ),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const result = await service.findAll();
      expect(result).toEqual(books);
      expect(mockBookRepository.find).toHaveBeenCalled();
    });

    it('should return books by status', async () => {
      const result = await service.findAll(BookStatus.BOOKED);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(books[1]);
      expect(result).toContainEqual(books[3]);
      expect(mockBookRepository.findBy).toHaveBeenCalledWith({ status: BookStatus.BOOKED });
    });
  })

  describe('findOne', () => {
    it('should return a book by ISBN', async () => {
      const result = await service.findOne('978-1-60309-511-2');
      expect(result).toEqual(books[0]);
      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({ isbn: '978-1-60309-511-2' });
    });

    it('should throw a NotFoundException if the book is not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('non-existing-isbn')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        isbn: randomUUID(),
        title: 'New Book',
        author: 'New Author',
      };
      const newBook = { ...createBookDto, status: BookStatus.AVAILABLE };
      mockBookRepository.insert.mockResolvedValue(null);
      mockBookRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockReturnValue(newBook);

      const result = await service.create(createBookDto);
      expect(result).toEqual(newBook);

      mockBookRepository.findOneBy.mockResolvedValue(newBook);
      expect(mockBookRepository.insert).toHaveBeenCalledWith(newBook);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Title' };
      const existingBook = { ...books[0] };
      const updatedBook = { ...existingBook, ...updateBookDto };

      mockBookRepository.findOneBy.mockResolvedValue(updatedBook);

      const result = await service.update('978-1-60309-511-2', updateBookDto);


      expect(result).toEqual(updatedBook);
      expect(mockBookRepository.update).toHaveBeenCalledWith(
        '978-1-60309-511-2',
        updateBookDto
      );
    });

    it('should throw a NotFoundException if the book is not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('invalid-isbn')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should remove a book', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(books[0]);
      const result = await service.delete('978-1-60309-511-2');
      expect(result).toEqual(books[0]);
      expect(mockBookRepository.delete).toHaveBeenCalledWith({ isbn: '978-1-60309-511-2' });
    });

    it('should throw a NotFoundException if the book is not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('invalid-isbn')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkout', () => {
    it('should checkout a book', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(books[1]);
      const updatedBook = await service.checkout('978-0-7432-7356-0', 'CHECKOUT');
      expect(updatedBook.status).toEqual(BookStatus.BOOKED);
    });

    it('should return a book', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(books[0]);
      const result = await service.checkout('978-1-60309-511-2', 'RETURN');
      expect(result.status).toEqual(BookStatus.AVAILABLE);
    });
  });
});
