import { BookStatus } from "../enum/book-status";
import { Column, Entity, PrimaryColumn } from "typeorm";

export type BookIsbn = string
export type BookTitle = string
export type BookAuthor = string

@Entity()
export class Book {
    @PrimaryColumn()
    isbn: BookIsbn

    @Column()
    title: BookTitle

    @Column()
    author: BookAuthor

    @Column()
    status: BookStatus
}