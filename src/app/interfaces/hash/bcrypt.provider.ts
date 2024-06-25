
export interface BcryptProvider {
  /**
   * Hash a password
   *
   * @param password
   * @param salt
   */
  hash(password: string, salt: number): Promise<string>;

  /**
   * Compare a password with a hash
   *
   * @param password
   * @param hash
   */
  compare(password: string, hash: string): Promise<boolean>;
}

export const BcryptProvider = Symbol('BcryptProvider');
