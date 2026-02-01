import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Para saber em que página estamos
import { 
  LayoutDashboard, 
  Users, 
  Folders, 
  FileText, 
  Settings,
  LogOut 
} from 'lucide-react'; 
import { Logo } from './Logo';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Users size={20} />, label: 'Clientes', href: '/admin/clients' },
    { icon: <Folders size={20} />, label: 'Projetos', href: '/admin/projects' },
    { icon: <FileText size={20} />, label: 'Documentos', href: '#' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
           <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Developer</p>
           <p className="text-xs font-semibold text-slate-700">André Silva</p>
        </div>
        <Link href="/login" className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-red-600 transition-colors text-sm font-medium">
          <LogOut size={18} />
          Sair
        </Link>
      </div>
    </aside>
  );
};