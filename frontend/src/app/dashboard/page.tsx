'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getDecryptedToken } from '@/lib/api/token.utils';
import LogoutButton from '@/components/LogoutButton';

interface DecodedToken {
  email: string;
  role: 'ADMIN' | 'USER';
  sub: string;
  exp: number;
}

interface User {
  _id: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = getDecryptedToken();
    const session = sessionStorage.getItem('sessionId');

    console.log('🔍 TOKEN:', token);
    console.log('🔍 SESSION:', session);

    if (!token || !session) {
      console.warn('⛔ Token o sesión no presentes');
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn('⏳ Token expirado');
        router.push('/login');
        return;
      }

      setRole(decoded.role);
      setUserId(decoded.sub);
      setSessionId(session);

      fetchUsers(token);
    } catch (err) {
      console.error('💥 Error al decodificar token:', err);
      router.push('/login');
      setLoading(false); // evita loop si decode falla
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await axios.get<User[]>('http://localhost:4000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setUsers(response.data);
    } catch (err) {
      console.error('🔥 Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    router.push('/register');
  };

  const handleEditProfile = () => {
    router.push(`/profile/${userId}`);
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bienvenido al Dashboard</h1>
        {sessionId && <LogoutButton sessionId={sessionId} />}
      </div>

      {role === 'ADMIN' && (
        <>
          <button
            onClick={handleCreateUser}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear nuevo usuario
          </button>
          <h2 className="text-xl font-semibold mb-2">Lista de todos los usuarios:</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user._id} className="p-2 border rounded">
                {user.email} – {user.role}
              </li>
            ))}
          </ul>
        </>
      )}

      {role === 'USER' && (
        <>
          <button
            onClick={handleEditProfile}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Editar mi perfil
          </button>
          <h2 className="text-xl font-semibold mb-2">Usuarios del sistema:</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user._id} className="p-2 border rounded">
                {user.email}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
