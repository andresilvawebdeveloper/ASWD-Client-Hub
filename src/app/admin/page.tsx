'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importado para permitir a navegação
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { CreateProjectModal } from "../../components/admin/CreateProjectModal";
import { Plus, Users, Layout, Clock, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Escutar a base de dados em tempo real
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 md:p-12">
      <header className="flex justify-between items-center mb-16">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white">Painel de Controlo</h1>
          <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">Gestão Centralizada ASWD</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl px-8 py-4 text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </header>

      {/* Estatísticas Dinâmicas baseadas nos dados reais do Firebase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<Users />} label="Clientes" value={projects.length.toString().padStart(2, '0')} />
        <StatCard icon={<Layout />} label="Projetos" value={projects.length.toString().padStart(2, '0')} />
        <StatCard icon={<Clock />} label="Aguardar" value="00" />
      </div>

      {/* Lista de Projetos Real-Time */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-white font-bold">Projetos Ativos</h3>
          <span className="text-[10px] bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            Live Update
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {loading ? (
            <div className="p-20 text-center text-slate-500 italic">A carregar projetos...</div>
          ) : projects.length === 0 ? (
            <div className="p-20 text-center text-slate-500">Nenhum projeto registado.</div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold">
                    {project.clientName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{project.projectName}</h4>
                    <p className="text-slate-500 text-xs">{project.clientName} • {project.clientEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Progresso</p>
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-1000" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* ALTERAÇÃO: Agora é um Link que leva à página do projeto [id] */}
                  <Link 
                    href={`/admin/project/${project.id}`}
                    className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="glass-card p-10 group hover:border-blue-500/50 transition-all">
      <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">{label}</p>
      <p className="text-5xl font-black text-white mt-2">{value}</p>
    </div>
  );
}