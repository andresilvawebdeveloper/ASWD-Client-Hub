'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Upload, File, Trash2, CheckCircle2 } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [newProgress, setNewProgress] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, "projects", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject(docSnap.data());
        setNewProgress(docSnap.data().progress);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdateProgress = async () => {
    setUpdating(true);
    try {
      const docRef = doc(db, "projects", id as string);
      await updateDoc(docRef, { progress: newProgress });
      setProject({ ...project, progress: newProgress });
      alert("Progresso atualizado!");
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (!project) return <div className="p-12 text-slate-500">A carregar detalhes...</div>;

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      {/* Botão Voltar */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar à Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Informação e Progresso */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10">
            <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Projeto Ativo</p>
            <h1 className="text-4xl font-black text-white mb-4">{project.projectName}</h1>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold">{project.clientName}</span>
              <span className="text-xs">{project.clientEmail}</span>
            </div>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-500" /> Gestão de Progresso
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Conclusão atual</span>
                <span className="text-3xl font-black text-white">{newProgress}%</span>
              </div>
              
              <input 
                type="range" min="0" max="100" 
                value={newProgress} 
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <button 
                onClick={handleUpdateProgress}
                disabled={updating}
                className="btn-premium w-full py-4 text-sm"
              >
                {updating ? "A guardar..." : "Guardar Alterações"} <Save size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Ficheiros */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Upload size={20} className="text-blue-500" /> Ativos do Projeto
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                <Upload size={32} className="mx-auto text-slate-700 group-hover:text-blue-500 transition-colors mb-2" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Upload de Ficheiros</p>
              </div>

              {/* Lista de Ficheiros (Exemplo estático por agora) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <File size={16} className="text-blue-400" />
                    <span className="text-xs text-slate-300">Logo-Final.png</span>
                  </div>
                  <Trash2 size={14} className="text-slate-600 hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}