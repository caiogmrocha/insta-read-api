import { Transform, Type } from "class-transformer";
import { IsDate, IsISBN, IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(65535)
  sinopsis: string;

  @IsNotEmpty()
  @Min(1)
  pages: number;

  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(255)
  author: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(255)
  category: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(255)
  publisher: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  publicationDate: Date;
}
