import { Injectable } from "@nestjs/common";

import { LoansRepository } from "@/app/interfaces/repositories/loans.repository";
import { PrismaProvider } from "./prisma.provider";
import { Loan } from "@/domain/entities/loan";

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor (
    private readonly prisma: PrismaProvider,
  ) {}

  public async getByReaderIdAndBookIdAndWithoutReturnAt(readerId: number, bookId: number): Promise<Loan | null> {
    const loanData = await this.prisma.loan.findFirst({
      where: {
        readerId,
        bookId,
        returnedAt: null,
      },
    });

    const loan = new Loan({
      id: loanData.id,
      readerId: loanData.readerId,
      bookId: loanData.bookId,
      loanAt: loanData.loanAt,
      expectedReturnAt: loanData.expectedReturnAt,
      returnedAt: loanData.returnedAt,
      createdAt: loanData.createdAt,
      updatedAt: loanData.updatedAt,
      deletedAt: loanData.deletedAt,
      deleted: loanData.deleted,
    });

    return loan;
  }

  public async create(loan: Loan): Promise<void> {
    await this.prisma.loan.create({
      data: {
        readerId: loan.readerId,
        bookId: loan.bookId,
        loanAt: loan.loanAt,
        expectedReturnAt: loan.expectedReturnAt,
      },
    });
  };
}
