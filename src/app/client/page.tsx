'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Logo } from '../../components/ui/Logo';
import { Layout, MessageSquare, Send, Clock, CheckCircle2, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ClientPortal() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Procura o projeto onde o clientEmail é igual ao email do utilizador logado
    const q = query(collection(db, "projects"), where("clientEmail", "==", user.email));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setProject({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const docRef = doc(db, "projects", project.id);
      await updateDoc(docRef, {
        feedback: arrayUnion({
          text: message,
          date: new Date().toISOString(),
          sender: 'client'
        })
      });
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 italic">A carregar o seu portal...</div>;

  if (!project) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <Logo className="h-20 mb-8 opacity-50" />
      <h1 className="text-white font-bold text-xl">Nenhum projeto associado.</h1>
      <p className="text-slate-500 text-sm mt-2">Contacte o André Silva para ativar o seu acesso.</p>
      <button onClick={handleLogout} className="mt-8 text-slate-400 flex items-center gap-2 hover:text-white transition-all">
        <LogOut size={18} /> Sair
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] p-6 md:p-12">
      {/* Header do Cliente */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <Logo className="h-16" />
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Bem-vindo,</p>
            <p className="text-white font-bold">{project.clientName}</p>
          </div>
          <button onClick={handleLogout} className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card de Progresso */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Estado do Site</span>
              <h2 className="text-4xl font-black text-white mt-4 mb-6">{project.projectName}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Progresso de Desenvolvimento</p>
                  <p className="text-3xl font-black text-blue-500">{project.progress}%</p>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>
            {/* Decoração de fundo */}
            <Layout className="absolute -right-8 -bottom-8 text-slate-800/20 w-64 h-64 -rotate-12" />
          </div>

          {/* Galeria de Prints (Updates do André) */}
          <div className="glass-card p-10">
            <h3 className="text-white font-bold flex items-center gap-2 mb-8">
              <CheckCircle2 size={20} className="text-blue-500" /> Pré-visualizações do Projeto
            </h3>
            {project.updates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.updates.map((update: any, i: number) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-800">
                    <img src={update.url} alt="Update" className="w-full h-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm italic">O André ainda não carregou imagens do desenvolvimento.</p>
            )}
          </div>
        </div>

        {/* Coluna de Mensagens / Envio de Conteúdos */}
        <div className="space-y-8">
          <div className="glass-card p-8 flex flex-col h-full">
            <h3 className="text-white font-bold flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-emerald-500" /> Enviar Conteúdos
            </h3>
            
            <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {project.feedback?.map((f: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl text-xs ${f.sender === 'client' ? 'bg-blue-600/10 border border-blue-600/20 ml-4' : 'bg-slate-800/50 mr-4'}`}>
                  <p className="text-slate-400 mb-1 font-bold uppercase text-[8px]">{f.sender === 'client' ? 'Você' : 'André Silva'}</p>
                  <p className="text-slate-200 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <textarea 
                placeholder="Escreva aqui textos, links ou feedback..."
                className="input-dark w-full h-32 pt-4 resize-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="absolute bottom-4 right-4 p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all text-white shadow-lg">
                <Send size={18} />
              </button>
            </form>
            <p className="text-[9px] text-slate-600 mt-4 uppercase font-bold text-center tracking-widest">O André será notificado</p>
          </div>
        </div>

      </div>
    </main>
  );
}