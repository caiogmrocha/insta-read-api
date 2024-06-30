import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UpdateReaderAccountParamsDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class UpdateReaderAccountBodyDto {
  @IsOptional()
  public name: string;

  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @MinLength(12)
  public password: string;
}
