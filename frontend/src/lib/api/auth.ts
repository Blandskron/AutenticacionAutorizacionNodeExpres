const AUTH_API = 'http://localhost:3000';

export async function login(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export async function logout() {
  const res = await fetch(`${AUTH_API}/logout`);
  if (!res.ok) throw new Error('Error al cerrar sesión');
  return res.json();
}
