import { IsISBN, IsNotEmpty, IsString } from "class-validator"

export class CreateBookDto {
    @IsISBN()
    isbn: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    author: string
}