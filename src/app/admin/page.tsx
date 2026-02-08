'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Logo } from '../../components/ui/Logo';
import { 
  Plus, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink, 
  LogOut 
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. AJUSTE O SEU EMAIL AQUI
  const ADMIN_EMAIL = "andresilva.webdev@gmail.com"; 

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Se não houver user, volta para a home de login
      if (!user) {
        router.push('/');
        return;
      }

      // Se o email não for o de admin, redireciona para o portal do cliente
      // Usamos toLowerCase() para evitar erros de comparação
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push('/client');
        return;
      }

      // Se for admin, carrega os projetos
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      
      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
        setLoading(false);
      }, (error) => {
        console.error("Erro no Firestore:", error);
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, [router]);

  const updateProgress = async (id: string, newProgress: number) => {
    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, { progress: newProgress });
    } catch (err) {
      console.error("Erro ao atualizar progresso:", err);
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm("Deseja eliminar este projeto permanentemente?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (err) {
        console.error("Erro ao eliminar:", err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-blue-500 font-black animate-pulse uppercase tracking-[0.3em] text-xs italic">
        A autenticar André Silva...
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] p-6 md:p-12 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
            <Logo className="h-10" />
            <div className="h-8 w-[1px] bg-slate-800 hidden md:block"></div>
            <div>
              <h1 className="text-white font-black text-xl uppercase tracking-tighter italic">Painel Admin</h1>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Controlo de Projetos</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/admin/new-project')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} /> Novo Projeto
            </button>
            <button 
              onClick={() => signOut(auth)}
              className="p-3 bg-slate-900 text-slate-500 hover:text-red-500 rounded-2xl border border-slate-800 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-[8px]">Total Clientes</p>
                <p className="text-2xl font-black text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><CheckCircle2 size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-[8px]">Pagos / Ativos</p>
                <p className="text-2xl font-black text-white">{projects.filter(p => p.status === 'pago' || p.status === 'Em Desenvolvimento').length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><TrendingUp size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-[8px]">Progresso Médio</p>
                <p className="text-2xl font-black text-white">
                  {Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / (projects.length || 1))}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Projetos */}
        <div className="glass-card border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
            <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <Clock size={18} className="text-blue-500" /> Fluxo de Trabalho
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                  <th className="p-8">Projeto</th>
                  <th className="p-8 text-center">Estado</th>
                  <th className="p-8">Progresso</th>
                  <th className="p-8">Valor</th>
                  <th className="p-8 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="p-8">
                      <p className="text-white font-black text-base">{p.projectName}</p>
                      <p className="text-slate-600 text-[10px] font-bold mt-1 uppercase italic">{p.clientEmail}</p>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${
                        p.status === 'pago' || p.status === 'Em Desenvolvimento'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                      } uppercase tracking-widest`}>
                        {p.status || 'Pendente'}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-4 group/slider">
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={p.progress || 0} 
                          onChange={(e) => updateProgress(p.id, parseInt(e.target.value))}
                          className="w-32 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 group-hover/slider:accent-blue-400"
                        />
                        <span className="text-xs font-black text-blue-500 w-8">{p.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="text-white font-black text-sm tracking-tighter">
                        {Number(p.valorTotal || 0).toFixed(2)}€
                      </div>
                    </td>
                    <td className="p-8 text-right space-x-3">
                      <button 
                        onClick={() => router.push(`/admin/project/${p.id}`)}
                        className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-500 hover:border-blue-500/40 rounded-xl transition-all"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProject(p.id)}
                        className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/40 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}