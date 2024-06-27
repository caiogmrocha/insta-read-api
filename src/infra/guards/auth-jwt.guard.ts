import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { Request } from "express";

import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor (
    @Inject(JwtProvider) private readonly jwtProvider: JwtProvider,
  ) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const [ type, token ] = request.headers.authorization?.split(" ") ?? [];

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid token");
    }

    let payload: unknown;

    try {
      payload = await this.jwtProvider.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new UnauthorizedException("Invalid token");
    }

    Object.assign(request, { user: payload });

    return true;
  }
}
