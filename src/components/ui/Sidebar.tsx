import React from 'react';
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
  const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin', active: true },
  { icon: <Users size={20} />, label: 'Clientes', href: '/admin/clients', active: false },
  // ... mude o href nos outros também
];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              item.active 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
        
        {/* Assinatura André Silva */}
        <div className="px-4 py-2 border-l-2 border-blue-600 bg-slate-50 rounded-r-lg">
           <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Developer</p>
           <p className="text-xs font-semibold text-slate-700 italic">André Silva</p>
        </div>
      </div>
    </aside>
  );
};