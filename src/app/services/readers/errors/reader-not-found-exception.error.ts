export class ReaderNotFoundException extends Error {
  constructor(key: 'email' | 'id', value: string | number) {
    super(`Reader with ${key} ${value} not found`);
  }
}
