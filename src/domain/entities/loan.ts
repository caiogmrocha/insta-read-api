import { Book } from "./book";
import { Entity, EntityProps } from "./entity";
import { Reader } from "./reader";

export const EXPECTED_LOAN_RETURN_DAYS = 15;

export type LoanProps = Partial<{
  id: number;
  readerId: number;
  bookId: number;
  loanAt: Date;
  expectedReturnAt: Date;
  returnedAt: Date;
  status: 'returned' | 'borrowed' | 'overdue' | 'requested';

  reader: Reader;
  book: Book;
}> & EntityProps;

export class Loan extends Entity<LoanProps> implements LoanProps {
  constructor (props: LoanProps) {
    super(props);

    if (props.status) {
      this.status = props.status;
    } else if (props.returnedAt) {
      this.status = 'returned';
    } else if (props.expectedReturnAt && props.expectedReturnAt < new Date()) {
      this.status = 'overdue';
    } else if (props.expectedReturnAt) {
      this.status = 'borrowed';
    } else {
      this.status = 'requested';
    }
  }

  public id: number;
  public readerId: number;
  public bookId: number;
  public loanAt: Date;
  public expectedReturnAt: Date;
  public returnedAt: Date;
  public status: LoanProps['status'];

  public reader: Reader;
  public book: Book;
}
