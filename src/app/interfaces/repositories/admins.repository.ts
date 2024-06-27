import { Admin } from "@/domain/entities/admin";

export interface AdminsRepository {
  getByEmail(email: string): Promise<Admin | null>;
}

export const AdminsRepository = Symbol('AdminsRepository');
