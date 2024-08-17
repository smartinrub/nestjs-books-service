import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindAllBooksQueryDto } from './dto/find-all-books-query.dto';
import { ExecuteTransactionQueryDto } from './dto/execute-transaction-query.dto';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) { }

    @Get()
    findAll(@Query(ValidationPipe) findAllBooksQueryDto?: FindAllBooksQueryDto) {
        return this.booksService.findAll(findAllBooksQueryDto.status)
    }

    @Get(':isbn')
    findOne(@Param('isbn') isbn: string) {
        return this.booksService.findOne(isbn)
    }

    @Post()
    create(@Body(ValidationPipe) createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto)
    }

    @Patch(':isbn')
    update(@Param('isbn') isbn: string, @Body(ValidationPipe) updateBookDto: UpdateBookDto) {
        return this.booksService.update(isbn, updateBookDto)
    }


    @Delete(':isbn')
    delete(@Param('isbn') isbn: string) {
        return this.booksService.delete(isbn)
    }

    @Post(':isbn/transaction')
    checkout(@Param('isbn') isbn: string, @Query(ValidationPipe) transaction: ExecuteTransactionQueryDto) {
        return this.booksService.checkout(isbn, transaction.action)
    }
}
