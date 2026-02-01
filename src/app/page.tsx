import { redirect } from 'next/navigation';

export default function RootPage() {
  // Por agora, vamos apenas mandar todos para o login
  redirect('/login');
}