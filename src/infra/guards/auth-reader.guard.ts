import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { Request } from "express";

import { User } from "@/domain/entities/user";
import { Reader } from "@/domain/entities/reader";

@Injectable()
export class AuthReaderGuard implements CanActivate {
  public async canActivate(context: ExecutionContext) {
    const user: User = context.switchToHttp().getRequest<Request>().user;

    if (!user) {
      throw new ForbiddenException('Only readers can access this route.');
    }

    if (user.type !== "reader") {
      throw new ForbiddenException('Only readers can access this route.');
    }

    if (user instanceof Reader && user.isArchived) {
      throw new ForbiddenException('Only active readers can access this route.');
    }

    return true;
  }
}
