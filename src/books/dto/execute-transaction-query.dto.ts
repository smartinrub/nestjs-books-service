import { IsEnum, IsOptional } from "class-validator";
import { TransactionAction } from "../enum/transaction-action";

export class ExecuteTransactionQueryDto {
    @IsOptional()
    @IsEnum(TransactionAction, { message: 'action must be one of: CHECKOUT, RELEASE' })
    action: TransactionAction
}