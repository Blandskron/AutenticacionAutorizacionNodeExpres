'use client';
import UserDetails from '@/components/UserDetails';

export default function UserPage({ params }: { params: { id: string } }) {
  return <UserDetails userId={params.id} />;
}
