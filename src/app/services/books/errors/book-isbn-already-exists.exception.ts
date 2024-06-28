export class BookISBNAlreadyExistsException extends Error {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} already exists`);
  }
}
