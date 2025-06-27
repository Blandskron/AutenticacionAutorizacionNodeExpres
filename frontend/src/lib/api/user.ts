import { getDecryptedToken } from './token.utils';

const USER_API = 'http://localhost:4000/users';

function authHeaders() {
  const token = getDecryptedToken();
  if (!token) throw new Error('Token ausente');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function getAllUsers() {
  const res = await fetch(USER_API, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`${USER_API}/${id}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function createUser(data: { email: string; password: string; role: string }) {
  const res = await fetch(USER_API, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear usuario');
  return res.json();
}

export async function updateUser(id: string, data: { email: string; password: string; role: string }) {
  const res = await fetch(`${USER_API}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${USER_API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar usuario');
  return res.json();
}
