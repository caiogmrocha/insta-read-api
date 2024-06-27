export interface JwtProvider {
  sign(payload: any, secret: string): Promise<string>;
  verify<T extends string | object>(token: string, secret: string): Promise<T>;
}

export const JwtProvider = Symbol('JwtProvider');
