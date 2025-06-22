'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/api/user';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ email, password, role });
      alert('Usuario registrado correctamente');
      router.push('/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 text-black">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Registro</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Registrarse
        </button>
      </form>
    </main>
  );
}
