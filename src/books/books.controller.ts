import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindAllBooksQueryDto } from './dto/find-all-books-query.dto';
import { ExecuteTransactionQueryDto } from './dto/execute-transaction-query.dto';
import { Book } from './entities/Book.entity';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) { }

    @Get()
    async findAll(
        @Query(ValidationPipe) findAllBooksQueryDto?: FindAllBooksQueryDto
    ): Promise<Book[]> {
        return this.booksService.findAll(findAllBooksQueryDto.status)
    }

    @Get(':isbn')
    async findOne(@Param('isbn') isbn: string): Promise<Book> {
        return this.booksService.findOne(isbn)
    }

    @Post()
    async create(@Body(ValidationPipe) createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.create(createBookDto)
    }

    @Patch(':isbn')
    async update(
        @Param('isbn') isbn: string,
        @Body(ValidationPipe) updateBookDto: UpdateBookDto
    ): Promise<Book> {
        return this.booksService.update(isbn, updateBookDto)
    }


    @Delete(':isbn')
    async delete(@Param('isbn') isbn: string) {
        return this.booksService.delete(isbn)
    }

    @Post(':isbn/transaction')
    async checkout(
        @Param('isbn') isbn: string,
        @Query(ValidationPipe) transaction: ExecuteTransactionQueryDto
    ): Promise<Book> {
        return this.booksService.checkout(isbn, transaction.action)
    }
}
