import { pbkdf2, randomBytes } from 'crypto';

export default class Hash {
  static readonly iterations = 10000;

  static readonly keyLength = 64;

  static readonly hashSeparator = '$';

  /**
   * Hashes a password
   */
  static async hash(password: string) {
    return new Promise<{ salt: string; hash: string; toString: () => string }>(
      (resolve, reject) => {
        const salt = randomBytes(32).toString('hex');

        pbkdf2(
          password,
          salt,
          Hash.iterations,
          Hash.keyLength,
          'sha256',
          (err, derivedKey) => {
            if (err) return reject(err);

            const obj = {
              salt,
              hash: derivedKey.toString('hex'),
              toString() {
                return `${this.hash}${Hash.hashSeparator}${this.salt}`;
              },
            };

            resolve(obj);
          },
        );
      },
    );
  }

  /**
   * Verifies a password against a hash with a salt
   */
  static async verify(password: string, hash: string, salt: string) {
    return new Promise<boolean>((resolve, reject) => {
      pbkdf2(
        password,
        salt,
        Hash.iterations,
        Hash.keyLength,
        'sha256',
        (err, derivedKey) => {
          if (err) return reject(err);

          resolve(derivedKey.toString('hex') === hash);
        },
      );
    });
  }

  /**
   * Verifies a password against a hash and salt stored in a string
   *
   * Format: `hash$salt`
   */
  static verifyFromStoredHash(plain: string, hashed: string) {
    const [hash, salt] = hashed.split(Hash.hashSeparator);

    return Hash.verify(plain, hash, salt);
  }
}
