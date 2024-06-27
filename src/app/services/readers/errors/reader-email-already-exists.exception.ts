export class ReaderEmailAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Reader with email ${email} already exists`);
  }
}
