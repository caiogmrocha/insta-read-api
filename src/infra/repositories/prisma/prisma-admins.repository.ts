import { Injectable } from "@nestjs/common";

import { AdminsRepository } from "@/app/interfaces/repositories/admins.repository";
import { PrismaProvider } from "./prisma.provider";
import { Admin } from "@/domain/entities/admin";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor (
    private readonly prismaProvider: PrismaProvider,
  ) {}

  public async getByEmail(email: string) {
    const adminData = await this.prismaProvider.admin.findFirst({
      where: {
        email,
      },
    });

    const admin = new Admin({
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      createdAt: adminData.createdAt,
      updatedAt: adminData.updatedAt,
      deletedAt: adminData.deletedAt,
      deleted: adminData.deleted,
    });

    return admin;
  }
}
