'use client';
import { useEffect, useState } from 'react';
import { getUserById, updateUser, deleteUser } from '@/lib/api/user';

export default function UserDetails({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    getUserById(userId).then(setUser);
  }, [userId]);

  const handleUpdate = async () => {
    await updateUser(userId, { email: user.email, password: user.password, role: user.role });
    alert('Usuario actualizado');
  };

  const handleDelete = async () => {
    await deleteUser(userId);
    alert('Usuario eliminado');
  };

  return (
    <div className="p-4">
      <input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
      <input value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
      <select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button onClick={handleUpdate}>Actualizar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
}
