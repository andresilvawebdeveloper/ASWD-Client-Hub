'use client';

import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Logo } from '../../../components/ui/Logo';
import { ChevronLeft, Save, Layout, Mail, Euro, Tag } from 'lucide-react';
import Link from 'next/link';

export default function NewProject() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    clientEmail: '',
    valorTotal: '',
    category: 'Desenvolvimento Web',
    progress: 0,
    status: 'Pendente'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        valorTotal: Number(formData.valorTotal),
        createdAt: serverTimestamp(),
        updates: [],
        feedback: []
      });
      router.push('/admin/dashboard');
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      alert("Erro ao criar projeto. Verifique a consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white mb-8 transition-all uppercase tracking-widest">
          <ChevronLeft size={14} /> Voltar ao Painel
        </Link>

        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl uppercase tracking-tighter italic">Novo Projeto</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Registo de cliente e contrato</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6 border border-slate-800/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Projeto</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  required
                  className="input-dark w-full pl-12"
                  placeholder="Ex: Loja Online X"
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
              <select 
                className="input-dark w-full appearance-none"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Design UI/UX">Design UI/UX</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email do Cliente (Para Acesso)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                required
                type="email"
                className="input-dark w-full pl-12"
                placeholder="cliente@email.com"
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Cliente</label>
              <input 
                required
                className="input-dark w-full"
                placeholder="Nome Completo / Empresa"
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valor Total (€)</label>
              <div className="relative">
                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  required
                  type="number"
                  className="input-dark w-full pl-12"
                  placeholder="0.00"
                  onChange={(e) => setFormData({...formData, valorTotal: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 mt-8 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'A CRIAR...' : <><Save size={18} /> GUARDAR PROJETO</>}
          </button>
        </form>
      </div>
    </main>
  );
}