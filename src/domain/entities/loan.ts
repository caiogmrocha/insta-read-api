import { Book } from "./book";
import { Entity, EntityProps } from "./entity";
import { Reader } from "./reader";

export type LoanProps = Partial<{
  id: number;
  readerId: number;
  bookId: number;
  loanAt: Date;
  returnedAt: Date;
  status: 'returned' | 'borrowed' | 'overdue' | 'available' | 'requested';

  reader: Reader;
  book: Book;
}> & EntityProps;

export class Loan extends Entity<LoanProps> implements LoanProps {
  public id: number;
  public readerId: number;
  public bookId: number;
  public loanAt: Date;
  public returnedAt: Date;
  public status: 'returned' | 'borrowed' | 'overdue' | 'available' | 'requested';

  public reader: Reader;
  public book: Book;
}
