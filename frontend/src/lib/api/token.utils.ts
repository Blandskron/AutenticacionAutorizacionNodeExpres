import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

const SECRET_KEY = 'bastian';

export function storeEncryptedToken(token: string): void {
  const ciphertext = AES.encrypt(token, SECRET_KEY).toString();
  sessionStorage.setItem('enc_token', ciphertext);
}

export function getDecryptedToken(): string | null {
  const encrypted = sessionStorage.getItem('enc_token');
  if (!encrypted) return null;
  try {
    const bytes = AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(Utf8);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  sessionStorage.removeItem('enc_token');
}
