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
  LogOut,
  ChevronRight
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Proteção de Rota: Só permite Admin
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "O_SEU_EMAIL_DE_ADMIN@exemplo.com") { // SUBSTITUA PELO SEU EMAIL
        router.push('/');
        return;
      }

      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      
      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
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
    if (window.confirm("Tem a certeza que deseja eliminar este projeto?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (err) {
        console.error("Erro ao eliminar:", err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-blue-500 font-black animate-pulse uppercase tracking-[0.3em] text-xs">A carregar dashboard admin...</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
            <Logo className="h-10" />
            <div className="h-8 w-[1px] bg-slate-800 hidden md:block"></div>
            <div>
              <h1 className="text-white font-black text-xl uppercase tracking-tighter">Admin Control</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Gestão de Projetos</p>
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

        {/* Stats Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 border-b-2 border-b-blue-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Clientes</p>
                <p className="text-2xl font-black text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-b-2 border-b-emerald-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><CheckCircle2 size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pagos</p>
                <p className="text-2xl font-black text-white">{projects.filter(p => p.status === 'pago' || p.status === 'Em Desenvolvimento').length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-b-2 border-b-orange-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><TrendingUp size={20}/></div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Progresso Médio</p>
                <p className="text-2xl font-black text-white">
                  {Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (projects.length || 1))}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Projetos */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-blue-500" /> Projetos em Curso
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="p-6">Projeto / Cliente</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6">Progresso</th>
                  <th className="p-6">Valor</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="p-6">
                      <p className="text-white font-bold">{p.projectName}</p>
                      <p className="text-slate-500 text-xs">{p.clientEmail}</p>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                        p.status === 'pago' || p.status === 'Em Desenvolvimento'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                      } uppercase tracking-tighter`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={p.progress} 
                          onChange={(e) => updateProgress(p.id, parseInt(e.target.value))}
                          className="w-24 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-xs font-black text-white">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="p-6 text-white font-mono text-sm">
                      {p.valorTotal}€
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <button 
                        onClick={() => router.push(`/admin/project/${p.id}`)}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProject(p.id)}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
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