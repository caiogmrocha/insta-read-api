export interface ReaderRepository {
  getByEmail(email: string): Promise<any>;
}

export const ReaderRepository = Symbol('ReaderRepository');
