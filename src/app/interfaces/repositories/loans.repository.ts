import { Loan } from "@/domain/entities/loan";

export interface LoansRepository {
  create: (loan: Loan) => Promise<Loan>;
}

export const LoansRepository = Symbol('LoansRepository');
