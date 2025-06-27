import { storeEncryptedToken, clearToken } from './token.utils';

const AUTH_API = 'http://localhost:3000';

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  const json = await res.json();
  if (json?.token) storeEncryptedToken(json.token);
  return json;
}

export async function logout() {
  clearToken();
  const res = await fetch(`${AUTH_API}/logout`);
  if (!res.ok) throw new Error('Error al cerrar sesión');
  return res.json();
}
