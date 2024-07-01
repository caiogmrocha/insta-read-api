import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class RequestBookLoanBodyDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  readerId: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  bookId: number;
}
