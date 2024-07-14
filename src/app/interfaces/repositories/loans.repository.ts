import { Loan } from "@/domain/entities/loan";

export interface LoansRepository {
  getByReaderIdAndBookIdAndWithoutReturnAt(readerId: number, bookId: number): Promise<Loan | null>;

  create(loan: Loan): Promise<void>;
}

export const LoansRepository = Symbol('LoansRepository');
