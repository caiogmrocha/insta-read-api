import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class ArchiveReaderAccountParamsDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  id: number;
}
