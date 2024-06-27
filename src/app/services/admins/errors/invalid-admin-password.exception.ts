export class InvalidAdminPasswordException extends Error {
  constructor(email: string) {
    super(`Invalid password for admin with email ${email}`);
  }
}
