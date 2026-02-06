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
  CreditCard,
  CheckCircle2, 
  Clock,
  ExternalLink
} from 'lucide-react';

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

  // FUNÇÃO: Enviar Orçamento e Ativar Pagamento no Portal
  const handleSendQuote = async () => {
    if (!project.valorTotal || project.valorTotal <= 0) {
      alert("Defina primeiro um valor total para o projeto na secção 'Gestão Financeira'.");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id as string);
      await updateDoc(projectRef, {
        status: 'aguardando_pagamento',
        feedback: arrayUnion({
          text: `📄 ORÇAMENTO DISPONÍVEL: O orçamento para o projeto "${project.projectName}" foi gerado. Valor: ${project.valorTotal}€. Pode efetuar o pagamento da adjudicação ou totalidade agora no seu portal.`,
          date: new Date().toISOString(),
          sender: 'admin'
        })
      });
      alert("Orçamento enviado com sucesso!");
    } catch (err) {
      console.error(err);
    }
  };

  // FUNÇÃO: Atualizar Valor Total
  const handleUpdateValue = async () => {
    const val = parseFloat(tempValue);
    if (isNaN(val) || val <= 0) {
      alert("Insira um valor válido.");
      return;
    }
    await updateDoc(doc(db, "projects", id as string), { valorTotal: val });
    setTempValue("");
    alert("Valor do projeto atualizado!");
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateUrl.trim()) return;
    await updateDoc(doc(db, "projects", id as string), {
      updates: arrayUnion({ url: newUpdateUrl, date: new Date().toISOString() })
    });
    setNewUpdateUrl("");
  };

  if (!project) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white italic">
      A carregar detalhes do projeto...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header de Navegação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-all">
              <ArrowLeft size={20} />
            </button>
            <Logo className="h-10" />
          </div>
          
          <button 
            onClick={handleSendQuote}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <FileText size={20} /> Enviar Orçamento
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: Gestão de Dados e Imagens */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card Principal e Progresso */}
            <div className="glass-card p-8 border-t-4 border-blue-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white">{project.projectName}</h1>
                  <p className="text-slate-500 mt-1">{project.clientName} • {project.clientEmail}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${project.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {project.status || 'Pendente'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slider de Progresso */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Progresso</span>
                    <span className="text-blue-500 font-black">{project.progress || 0}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={project.progress || 0}
                    onChange={async (e) => await updateDoc(doc(db, "projects", id as string), { progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Gestão Financeira */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Valor Total</span>
                    <span className="text-emerald-500 font-black">{project.valorTotal || 0}€</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Novo valor..."
                      className="input-dark flex-1 h-10 text-sm"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                    <button onClick={handleUpdateValue} className="bg-slate-800 px-4 rounded-xl text-white text-[10px] font-bold hover:bg-slate-700 uppercase">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeria de Updates */}
            <div className="glass-card p-8">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-500" /> Prints de Desenvolvimento
              </h3>
              <form onSubmit={handleAddUpdate} className="flex gap-2 mb-8">
                <input 
                  type="url" 
                  placeholder="Cole o link da imagem aqui..."
                  className="input-dark flex-1"
                  value={newUpdateUrl}
                  onChange={(e) => setNewUpdateUrl(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-xl text-white font-bold hover:bg-blue-500 transition-all">
                  Upload
                </button>
              </form>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.updates?.map((img: any, i: number) => (
                  <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                    <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Chat Admin */}
          <div className="glass-card p-8 flex flex-col h-[650px]">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Send size={18} className="text-blue-500" /> Comunicação com Cliente
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              {project.feedback?.map((f: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl ${f.sender === 'admin' ? 'bg-blue-600/10 border border-blue-600/20 ml-6' : 'bg-slate-800/40 mr-6'}`}>
                  <p className="text-[8px] font-black uppercase mb-1 tracking-widest text-slate-500">
                    {f.sender === 'admin' ? 'André Silva' : 'Cliente'}
                  </p>
                  <p className="text-slate-200 text-xs leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <textarea 
                placeholder="Escreva a sua resposta..."
                className="input-dark w-full h-32 pt-4 resize-none text-sm"
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
              />
              <button 
                onClick={async () => {
                  if (!adminMessage.trim()) return;
                  await updateDoc(doc(db, "projects", id as string), {
                    feedback: arrayUnion({ text: adminMessage, date: new Date().toISOString(), sender: 'admin' })
                  });
                  setAdminMessage("");
                }}
                className="absolute bottom-4 right-4 p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}