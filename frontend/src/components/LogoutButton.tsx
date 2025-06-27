'use client';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api/token.utils';

export default function LogoutButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    clearToken(); // Elimina token del frontend
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Cerrar sesión
    </button>
  );
}
