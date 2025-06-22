const USER_API = 'http://localhost:4000/users';

export async function getAllUsers() {
  const res = await fetch(USER_API, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`${USER_API}/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function createUser(data: {
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(USER_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear usuario');
  return res.json();
}

export async function updateUser(id: string, data: {
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${USER_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${USER_API}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar usuario');
  return res.json();
}
