export class BookLoanRequestAlreadyExistsException extends Error {
  constructor (readerId: number, bookId: number) {
    super(`Loan request for book ${bookId} already exists for reader ${readerId}`);
  }
}
