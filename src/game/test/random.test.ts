import * as Passwords from '../random';

describe('random', () => {
  it('password is expected length', () => {
    expect(Passwords.getPassword(0, 0, 10)).toHaveLength(10);
  });

  it('generates the same password given the same input', () => {
    const seed = 1.3475;
    expect(Passwords.getPassword(seed, 0, 20))
      .toEqual(Passwords.getPassword(seed, 0, 20));
  });

  it('each generator generates different passwords', () => {
    const seed = 0.4567;
    expect(Passwords.getPassword(seed, 0, 20))
      .not.toEqual(Passwords.getPrivateKey(seed, 0, 20));
    expect(Passwords.getPrivateKey(seed, 0, 20))
      .not.toEqual(Passwords.getPublicKey(seed, 0, 20));
  });
});
