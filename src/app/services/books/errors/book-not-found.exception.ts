export class BookNotFoundException extends Error {
  constructor(key: 'isbn' | 'id', value: string | number) {
    super(`Book with ${key} ${value} not found`);
  }
}
