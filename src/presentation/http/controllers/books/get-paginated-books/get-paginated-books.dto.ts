import { Book } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class GetPaginatedBooksDto {
  @Transform(({ value }) => value ? parseInt(value, 10) : 1)
  @IsInt()
  @IsPositive()
  page: number;

  @Transform(({ value }) => value ? parseInt(value, 10) : 1)
  @IsInt()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Transform(({ value }) => value ? JSON.parse(value) : 1)
  @IsArray()
  @IsIn(<Array<keyof Book>>[
    'isbn',
    'title',
    'sinopsis',
    'pages',
    'amount',
    'author',
    'category',
    'publisher',
    'publicationDate',
  ], { each: true })
  fields?: Array<keyof Book>;
}
