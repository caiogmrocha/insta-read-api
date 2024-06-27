export class AdminNotFoundException extends Error {
  constructor(key: 'email' | 'id', value: string | number) {
    super(`Admin with ${key} ${value} not found`);
  }
}1
