'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Users, FileUp, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const items = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Users size={20} />, label: 'Clientes', href: '/admin/clients' },
    { icon: <FileUp size={20} />, label: 'Arquivos', href: '/admin/files' },
  ];

  return (
    <aside className="w-72 h-screen bg-[#0F172A] border-r border-slate-800 flex flex-col p-8 flex-shrink-0">
      
      <div className="mb-12 flex justify-center py-4">
        <Logo className="h-32 w-auto transition-transform hover:scale-105 duration-300" />
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} 
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest ${
              pathname === item.href 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-slate-800/30'
            }`}>
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 text-slate-600 hover:text-red-500 transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
          <span className="text-[10px] font-black uppercase tracking-widest">Sair do Portal</span>
        </button>
      </div>
    </aside>
  );
};