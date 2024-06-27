export interface JwtProvider {
  sign(payload: any, secret: string): string;
  verify(token: string, secret: string): any;
}

export const JwtProvider = Symbol('JwtProvider');
