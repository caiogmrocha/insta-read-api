export class ReaderAccountDeactivatedException extends Error {
  constructor (key: 'email' | 'id', value: string | number) {
    super(`Reader account with ${key === 'id' ? `#${value}` : key} ${value} is deactivated`);
  }
}
