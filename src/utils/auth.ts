import pkg from 'bcryptjs';

export async function hashPassword(password: string) {
    const hashedPassword = await pkg.hash(password, 12);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const isValid = await pkg.compare(password, hashedPassword);
    return isValid;
}