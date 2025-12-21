// ...existing code...
import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
// ...existing code...

export async function hashing(password: string): Promise<string> {
  // generate salted hash
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

export async function compareHash(password: string, hash: string): Promise<boolean> {
  // verify password with stored hash
  return await bcrypt.compare(password, hash);
}
