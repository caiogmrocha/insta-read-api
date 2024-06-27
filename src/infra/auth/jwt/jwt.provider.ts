import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";

@Injectable()
export class JwtProviderImpl implements JwtProvider {
  constructor (
    private readonly jwtService: JwtService
  ) {}

  public async sign(payload: any, secret: string): Promise<string> {
    return this.jwtService.sign(payload, { secret });
  }

  public async verify<T extends string | object>(token: string, secret: string): Promise<T> {
    return this.jwtService.verify(token, { secret }) as T;
  }
}
