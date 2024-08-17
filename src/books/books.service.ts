import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from './enum/book-status';

@Injectable()
export class BooksService {
    private books = [
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
        {
            "isbn": "978-0-14-312774-1",
            "title": "Thinking, Fast and Slow",
            "author": "Daniel Kahneman",
            "status": "BOOKED"
        },
        {
            "isbn": "978-0-06-231611-0",
            "title": "The Power of Habit",
            "author": "Charles Duhigg",
            "status": "AVAILABLE"
        },
        {
            "isbn": "978-0-7432-7356-1",
            "title": "Angels & Demons",
            "author": "Dan Brown",
            "status": "AVAILABLE"
        },
        {
            "isbn": "978-0-394-48076-3",
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "status": "BOOKED"
        },
        {
            "isbn": "978-1-5011-6877-3",
            "title": "Where the Crawdads Sing",
            "author": "Delia Owens",
            "status": "AVAILABLE"
        },
        {
            "isbn": "978-0-375-70270-0",
            "title": "The Road",
            "author": "Cormac McCarthy",
            "status": "BOOKED"
        }
    ]

    findAll(status?: BookStatus) {
        if (status) {
            return this.books.filter(book => book.status === status)
        }
        return this.books
    }

    findOne(isbn: string) {
        const book = this.books.find(book => book.isbn === isbn)
        if (!book) {
            throw new NotFoundException('Book Not Found')
        }
        return book
    }

    create(craeteBookDto: CreateBookDto) {
        const newBook = {
            ...craeteBookDto,
            status: BookStatus.AVAILABLE
        }
        this.books.push(newBook)
        return newBook
    }

    update(isbn: string, updateBookDto: UpdateBookDto) {
        this.books = this.books.map(book => {
            if (book.isbn === isbn) {
                return { ...book, ...updateBookDto }
            }
            return book
        })

        return this.findOne(isbn)
    }

    delete(isbn: string) {
        const removedBook = this.findOne(isbn)

        this.books = this.books.filter(book => book.isbn !== isbn)

        return removedBook
    }

    checkout(isbn: string, action: string) {
        switch (action) {
            case 'CHECKOUT':
                return this.update(isbn, { status: BookStatus.BOOKED })
            case 'RETURN':
                return this.update(isbn, { status: BookStatus.AVAILABLE })
        }
    }
}
