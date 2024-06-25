import { Reader } from "src/domain/entities/reader";

export interface ReaderRepository {
  getByEmail(email: string): Promise<any>;
  create(params: Reader): Promise<void>;
}

export const ReaderRepository = Symbol('ReaderRepository');
