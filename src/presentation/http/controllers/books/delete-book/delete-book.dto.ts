import { Transform } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class DeleteBookDto {
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value, 10) : 1)
  @IsPositive()
  public id: number;
}
