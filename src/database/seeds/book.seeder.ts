import { BookStatus } from "src/books/enum/book-status";
import { Book } from "../../books/entities/Book.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class BookSeeder implements Seeder {
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

    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        await dataSource.query('TRUNCATE "book" RESTART IDENTITY;');
        const repository = dataSource.getRepository(Book)

        await Promise.all(
            this.books.map((book) =>
                repository.insert({
                    ...book,
                    status: book.status as BookStatus
                })
            )
        )
        console.log('Books have been seeded');
    }
}