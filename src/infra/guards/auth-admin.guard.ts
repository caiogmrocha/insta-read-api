import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { Request } from "express";

import { User } from "@/domain/entities/user";

@Injectable()
export class AuthAdminGuard implements CanActivate {
  public async canActivate(context: ExecutionContext) {
    const user: User = context.switchToHttp().getRequest<Request>().user;

    if (!user) {
      throw new ForbiddenException('Only admins can access this route.');
    }

    if (user.type !== "admin") {
      throw new ForbiddenException('Only admins can access this route.');
    }

    return true;
  }
}
