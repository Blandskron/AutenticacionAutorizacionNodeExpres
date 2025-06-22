'use client';
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/lib/api/user';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      alert('Error al obtener usuarios');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">Panel de Usuarios</h1>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li key={user._id} className="border p-2 rounded bg-gray-100">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
