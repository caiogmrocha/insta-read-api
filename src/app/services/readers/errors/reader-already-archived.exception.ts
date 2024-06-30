export class ReaderAlreadyArchivedException extends Error {
  constructor(id: number) {
    super(`Reader #${id} is already archived.`);
  }
}
