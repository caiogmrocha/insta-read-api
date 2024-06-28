import { Entity, EntityProps } from "./entity";

export type BookProps = Partial<{
  id: number;
  isbn: string;
  title: string;
  sinopsis: string;
  pages: number;
  amount: number;
  author: string;
  category: string;
  publisher: string;
  publicationDate: Date;
}> & Partial<EntityProps>;

export class Book extends Entity<BookProps> implements BookProps {
  public id: number;
  public isbn: string;
  public title: string;
  public sinopsis: string;
  public pages: number;
  public amount: number;
  public author: string;
  public category: string;
  public publisher: string;
  public publicationDate: Date;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt?: Date;
  public deleted: boolean;
}
