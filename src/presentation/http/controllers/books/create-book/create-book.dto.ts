import { IsDate, IsDateString, IsISBN, IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

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
  @MaxLength(255)
  sinopsis: string;

  @IsNotEmpty()
  @Min(1)
  pages: number;

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
  @IsDateString()
  publicationDate: Date;
}
