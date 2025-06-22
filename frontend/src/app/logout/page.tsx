'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      localStorage.removeItem('user');
      alert('Sesión cerrada');
      router.push('/login');
    };
    doLogout();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center text-black">
      <p className="text-lg">Cerrando sesión...</p>
    </main>
  );
}
