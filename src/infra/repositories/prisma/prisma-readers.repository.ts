import { Injectable } from '@nestjs/common';

import { Reader } from '@/domain/entities/reader';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { PrismaProvider } from './prisma.provider';

@Injectable()
export class PrismaReadersRepository implements ReadersRepository {
  constructor (
    private readonly prismaProvider: PrismaProvider,
  ) {}

  public async getById(id: number): Promise<Reader | null> {
    const readerData = await this.prismaProvider.reader.findFirst({
      where: {
        id,
      },
    });

    if (!readerData) {
      return null;
    }

    const reader = new Reader({
      id: readerData.id,
      name: readerData.name,
      email: readerData.email,
      password: readerData.password,
      isArchived: readerData.archived,
      archivedAt: readerData.archivedAt,
      createdAt: readerData.createdAt,
      updatedAt: readerData.updatedAt,
      deletedAt: readerData.deletedAt,
      deleted: readerData.deleted,
    });

    return reader;
  }

  public async getByEmail(email: string): Promise<Reader | null> {
    const readerData = await this.prismaProvider.reader.findFirst({
      where: {
        email,
      },
    });

    const reader = readerData ? new Reader({
      id: readerData.id,
      name: readerData.name,
      email: readerData.email,
      password: readerData.password,
      isArchived: readerData.archived,
      archivedAt: readerData.archivedAt,
      createdAt: readerData.createdAt,
      updatedAt: readerData.updatedAt,
      deletedAt: readerData.deletedAt,
      deleted: readerData.deleted,
    }) : null;

    return reader;
  }

  public async create(params: Reader): Promise<void> {
    await this.prismaProvider.reader.create({
      data: {
        email: params.email,
        name: params.name,
        password: params.password,
      },
    });
  }

  public async update(params: Reader): Promise<void> {
    await this.prismaProvider.reader.update({
      where: {
        id: params.id,
      },
      data: {
        email: params.email,
        name: params.name,
        password: params.password,
        archived: params.isArchived,
        archivedAt: params.archivedAt,
      },
    });
  }
}

