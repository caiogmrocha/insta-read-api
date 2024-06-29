import { IsDate, IsISBN, IsInt, IsNotEmpty, IsOptional, MaxLength, Min, MinLength } from "class-validator";

import { Transform, Type } from "class-transformer";

export class UpdateBookParamsDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class UpdateBookBodyDto {
  @IsOptional()
  @IsISBN()
  isbn: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(65535)
  sinopsis: string;

  @IsOptional()
  @Min(1)
  pages: number;

  @IsOptional()
  @Min(1)
  amount: number;

  @IsOptional()
  @MinLength(0)
  @MaxLength(255)
  author: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(255)
  category: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(255)
  publisher: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  publicationDate: Date;
}
