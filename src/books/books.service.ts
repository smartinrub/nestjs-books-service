import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from './enum/book-status';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/Book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

    async findAll(status?: BookStatus): Promise<Book[]> {
        if (status) {
            return this.bookRepository.findBy({ status: status })
        }
        return this.bookRepository.find()
    }

    async findOne(isbn: string): Promise<Book> {
        const book = await this.bookRepository.findOneBy({ isbn: isbn })
        if (!book) {
            throw new NotFoundException('Book Not Found')
        }
        return book
    }

    async create(craeteBookDto: CreateBookDto): Promise<Book> {
        const existingBook = await this.bookRepository.findOneBy({ isbn: craeteBookDto.isbn })
        if (existingBook) {
            throw new ConflictException('Book with provided ISBN already exists')
        }
        const newBook = {
            ...craeteBookDto,
            status: BookStatus.AVAILABLE
        }
        this.bookRepository.insert({ ...newBook })
        return await this.bookRepository.findOneBy({ isbn: craeteBookDto.isbn })
    }

    async update(isbn: string, updateBookDto: UpdateBookDto): Promise<Book> {
        await this.bookRepository.update(isbn, { ...updateBookDto })
        return await this.bookRepository.findOneBy({ isbn: isbn })
    }

    async delete(isbn: string): Promise<Book> {
        const removedBook = this.findOne(isbn)
        this.bookRepository.delete({ isbn: isbn })
        return removedBook
    }

    async checkout(isbn: string, action: string): Promise<Book> {
        switch (action) {
            case 'CHECKOUT':
                return this.update(isbn, { status: BookStatus.BOOKED })
            case 'RETURN':
                return this.update(isbn, { status: BookStatus.AVAILABLE })
        }
    }
}
