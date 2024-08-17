import { IsEnum, IsOptional } from "class-validator";
import { CreateBookDto } from "./create-book.dto";
import { PartialType } from "@nestJs/mapped-types"
import { BookStatus } from "../enum/book-status";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsEnum(BookStatus, {
        message: 'Valid status required'
    })
    @IsOptional()
    status?: BookStatus
}