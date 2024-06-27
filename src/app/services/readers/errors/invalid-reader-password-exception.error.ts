export class InvalidReaderPasswordException extends Error {
  constructor(email: string) {
    super(`Invalid password for reader with email ${email}`);
  }
}
