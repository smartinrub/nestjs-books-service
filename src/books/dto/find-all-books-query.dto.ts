import { IsEnum, IsOptional } from "class-validator";
import { BookStatus } from "../enum/book-status";

export class FindAllBooksQueryDto {
    @IsOptional()
    @IsEnum(BookStatus, { message: 'status must be one of: AVAILABLE, BOOKED' })
    status?: BookStatus;
}