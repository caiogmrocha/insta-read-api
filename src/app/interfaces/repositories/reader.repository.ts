import { Reader } from "src/domain/entities/reader";

export interface ReadersRepository {
  getById(id: number): Promise<Reader | null>;
  getByEmail(email: string): Promise<Reader | null>;
  create(params: Reader): Promise<void>;
  update(params: Reader): Promise<void>;
}

export const ReadersRepository = Symbol('ReadersRepository');
