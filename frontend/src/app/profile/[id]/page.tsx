'use client';

import { useEffect, useState } from 'react';
import { getUserById, updateUser } from '@/lib/api/user';
import { useParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUserById(id as string).then(user => {
      setForm({ email: user.email, password: '', role: user.role });
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateUser(id as string, form);
    setMessage('Perfil actualizado con éxito');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Editar mi perfil</h1>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo"
        className="block mb-2 p-2 border rounded"
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Nueva contraseña"
        type="password"
        className="block mb-2 p-2 border rounded"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="block mb-4 p-2 border rounded"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar cambios
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
