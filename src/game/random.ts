import seedrandom from 'seedrandom';

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789.,:;*@!#$%&/()=?+';

const PRIVATE_KEY_SALT = '4fjdsklfjdsvc';
const PUBLIC_KEY_SALT = 'fdsjky768768787';
const PASSWORD_SALT = 'bvmnykyykykykyky234324';

const generate = (
  rng: any,
  length: number,
): string => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const rand: number = rng();
    const index = Math.floor(rand * CHARACTERS.length);
    result += CHARACTERS[index];
  }
  return result;
};

export const getNumber = (seed: number, salt: number): number => {
  return new seedrandom(seed + salt)() as number
}

export const getPrivateKey = (seed: number, index: number, length: number): string => {
  return generate(new seedrandom(PRIVATE_KEY_SALT + seed + index + length), length);
};

export const getPublicKey = (seed: number, index: number, length: number): string => {
  return generate(new seedrandom(PUBLIC_KEY_SALT + seed + index + length), length);
};

export const getPassword = (seed: number, index: number, length: number): string => {
  return generate(new seedrandom(PASSWORD_SALT + seed + index + length), length);
};
