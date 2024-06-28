import { Book } from "@prisma/client";
import { IsArray, IsIn, IsInt, IsPositive, IsString } from "class-validator";

export class GetPaginatedBooksDto {
  @IsInt()
  @IsPositive()
  page: number;

  @IsInt()
  @IsPositive()
  limit: number;

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
