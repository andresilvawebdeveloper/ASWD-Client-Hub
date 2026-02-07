'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../../../../lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { Logo } from '../../../../components/ui/Logo';
import { 
  ArrowLeft, 
  Send, 
  FileText, 
  Image as ImageIcon, 
  Wrench,
  CheckCircle2, 
  Clock,
  Trash2,
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [newUpdateUrl, setNewUpdateUrl] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "projects", id as string), (doc) => {
      if (doc.exists()) {
        setProject({ id: doc.id, ...doc.data() });
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleSendQuote = async (type: 'Desenvolvimento' | 'Manutenção') => {
    if (!project.valorTotal || project.valorTotal <= 0) {
      alert("Defina primeiro um valor total.");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id as string);
      await updateDoc(projectRef, {
        status: 'aguardando_pagamento',
        category: type,
        feedback: arrayUnion({
          text: `🚀 NOVO ORÇAMENTO DE ${type.toUpperCase()}: Valor: ${project.valorTotal}€. Disponível para pagamento no portal.`,
          date: new Date().toISOString(),
          sender: 'admin'
        })
      });
      alert(`Orçamento de ${type} enviado! O cliente já pode pagar.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetStatus = async () => {
    if (confirm("Deseja remover o orçamento? O portal deixará de mostrar as opções de pagamento.")) {
      await updateDoc(doc(db, "projects", id as string), { status: 'pendente' });
    }
  };

  const handleMarkAsPaid = async () => {
    if (confirm("Marcar como PAGO (recebido por fora)?")) {
      await updateDoc(doc(db, "projects", id as string), { 
        status: 'pago',
        feedback: arrayUnion({
          text: "✅ PAGAMENTO CONFIRMADO: Recebemos o valor via MBWay/Direto. Projeto liquidado.",
          date: new Date().toISOString(),
          sender: 'admin'
        })
      });
    }
  };

  if (!project) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white italic">A carregar...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header com botões de ação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <Logo className="h-8" />
              {/* BOTÃO VER VISÃO DO CLIENTE */}
              <Link 
                href={`/client?email=${project.clientEmail}`} 
                target="_blank"
                className="text-slate-500 hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2 transition-colors"
              >
                <ExternalLink size={12} /> Ver visão do cliente
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleSendQuote('Desenvolvimento')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <FileText size={18} /> Enviar Orçamento
            </button>
            <button 
              onClick={() => handleSendQuote('Manutenção')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Wrench size={18} /> Enviar Manutenção
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card Info & Progresso */}
            <div className="glass-card p-8 border-t-4 border-blue-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white">{project.projectName}</h1>
                  <p className="text-slate-500">{project.clientName} • {project.clientEmail}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${project.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {project.status || 'Pendente'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                  <span className="text-slate-500 text-[10px] font-black uppercase block mb-4">Progresso: {project.progress || 0}%</span>
                  <input 
                    type="range" min="0" max="100" value={project.progress || 0}
                    onChange={async (e) => await updateDoc(doc(db, "projects", id as string), { progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                  <span className="text-slate-500 text-[10px] font-black uppercase block mb-4">Valor Total: {project.valorTotal || 0}€</span>
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Valor..." className="input-dark flex-1 h-10 text-sm"
                      value={tempValue} onChange={(e) => setTempValue(e.target.value)}
                    />
                    <button onClick={async () => {
                      if(!tempValue) return;
                      await updateDoc(doc(db, "projects", id as string), { valorTotal: parseFloat(tempValue) });
                      setTempValue("");
                    }} className="bg-slate-800 px-4 rounded-xl text-white text-[10px] font-bold">OK</button>
                  </div>
                </div>
              </div>

              {/* AÇÕES DE ESTADO */}
              <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleResetStatus} className="flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase bg-slate-800/50 text-slate-400 hover:text-red-400 border border-slate-800">
                  <Clock size={14} /> Alterar Orçamento
                </button>
                <button onClick={handleMarkAsPaid} className="flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase bg-emerald-900/10 text-emerald-500 hover:bg-emerald-900/20 border border-emerald-900/20">
                  <CheckCircle2 size={14} /> Marcar como Pago
                </button>
              </div>
            </div>

            {/* Updates Galeria */}
            <div className="glass-card p-8">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-blue-500" /> Desenvolvimento</h3>
              <form onSubmit={async (e: any) => {
                e.preventDefault();
                if(!newUpdateUrl.trim()) return;
                await updateDoc(doc(db, "projects", id as string), { updates: arrayUnion({ url: newUpdateUrl, date: new Date().toISOString() }) });
                setNewUpdateUrl("");
              }} className="flex gap-2 mb-8">
                <input type="url" placeholder="Link da imagem..." className="input-dark flex-1" value={newUpdateUrl} onChange={(e) => setNewUpdateUrl(e.target.value)} />
                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-xl text-white font-bold">Add</button>
              </form>
              <div className="grid grid-cols-4 gap-4">
                {project.updates?.map((img: any, i: number) => (
                  <img key={i} src={img.url} className="h-20 w-full object-cover rounded-xl border border-slate-800 shadow-lg" alt="update" />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Chat */}
          <div className="glass-card p-8 flex flex-col h-[650px]">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Send size={18} className="text-blue-500" /> Chat com Cliente</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              {project.feedback?.map((f: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl ${f.sender === 'admin' ? 'bg-blue-600/10 border border-blue-600/20 ml-6' : 'bg-slate-800/40 mr-6'}`}>
                  <p className="text-[8px] font-black uppercase mb-1 text-slate-500">{f.sender === 'admin' ? 'André Silva' : 'Cliente'}</p>
                  <p className="text-slate-200 text-xs">{f.text}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <textarea placeholder="Mensagem..." className="input-dark w-full h-24 pt-4 resize-none" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} />
              <button onClick={async () => {
                if (!adminMessage.trim()) return;
                await updateDoc(doc(db, "projects", id as string), { feedback: arrayUnion({ text: adminMessage, date: new Date().toISOString(), sender: 'admin' }) });
                setAdminMessage("");
              }} className="absolute bottom-4 right-4 p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}