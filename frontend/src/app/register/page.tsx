'use client';
import { useState } from 'react';
import { createUser } from '@/lib/api/user';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createUser({ email, password, role });
    setSuccess(`Usuario creado con ID: ${res.userId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h2>Registrar nuevo usuario</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button type="submit">Registrar</button>
      {success && <p>{success}</p>}
    </form>
  );
}
