import { Injectable } from "@nestjs/common";

import { LoansRepository } from "@/app/interfaces/repositories/loans.repository";
import { PrismaProvider } from "./prisma.provider";
import { Loan } from "@/domain/entities/loan";

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor (
    private readonly prisma: PrismaProvider,
  ) {}

  public async create(loan: Loan): Promise<Loan> {
    const createdLoan = await this.prisma.loan.create({
      data: {
        readerId: loan.readerId,
        bookId: loan.bookId,
        loanAt: loan.loanAt,
        expectedReturnAt: loan.expectedReturnAt,
        status: loan.status,
      },
    });

    return new Loan({
      id: createdLoan.id,
      readerId: createdLoan.readerId,
      bookId: createdLoan.bookId,
      loanAt: createdLoan.loanAt,
      expectedReturnAt: createdLoan.expectedReturnAt,
      returnAt: createdLoan.returnAt,
      status: createdLoan.status,
      createdAt: createdLoan.createdAt,
      updatedAt: createdLoan.updatedAt,
      deletedAt: createdLoan.deletedAt,
      deleted: createdLoan.deleted,
    });
  };
}
