'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Logo } from '../../components/ui/Logo';
import { 
  Layout, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  LogOut, 
  CreditCard, 
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ClientPortal() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "projects"), where("clientEmail", "==", user.email));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setProject({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePayment = async (type: 'deposit' | 'full') => {
    setIsPaying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: type === 'deposit' ? project.valorTotal / 2 : project.valorTotal,
          projectName: project.projectName,
          customerEmail: project.clientEmail,
          projectId: project.id,
          paymentType: type
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

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

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 italic">
      A carregar o seu portal...
    </div>
  );

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

  // Define cores e ícones baseados na categoria enviada pelo Admin
  const isMaintenance = project.category === 'Manutenção';
  const themeColor = isMaintenance ? 'orange' : 'blue';

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
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARD DE PAGAMENTO DINÂMICO (Desenvolvimento vs Manutenção) */}
          {project.status !== 'pago' && project.valorTotal > 0 && (
            <div className={`glass-card p-10 border-l-4 ${isMaintenance ? 'border-orange-500 bg-orange-600/5' : 'border-blue-500 bg-blue-600/5'} relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                      {isMaintenance ? <Wrench className="text-orange-500" /> : <CreditCard className="text-blue-500" />} 
                      {isMaintenance ? 'Ativação de Manutenção' : 'Adjudicação do Projeto'}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      {isMaintenance 
                        ? 'Subscrição de suporte e atualizações mensais.' 
                        : 'Escolha uma modalidade para iniciar o desenvolvimento.'}
                    </p>
                  </div>
                  <ShieldCheck size={40} className="text-slate-800/50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opção 50% - Apenas visível em Desenvolvimento */}
                  {!isMaintenance && (
                    <button 
                      disabled={isPaying}
                      onClick={() => handlePayment('deposit')}
                      className="p-6 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all text-left group disabled:opacity-50"
                    >
                      <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Sinal de Entrada (50%)</p>
                      <p className="text-2xl font-black text-white mt-1">
                        {(project.valorTotal / 2).toFixed(2)}€
                      </p>
                      <p className="text-blue-300 text-[10px] mt-4 font-bold group-hover:translate-x-1 transition-transform italic">
                        {isPaying ? 'A PROCESSAR...' : 'PAGAR AGORA →'}
                      </p>
                    </button>
                  )}

                  {/* Opção Totalidade - Muda de cor se for Manutenção */}
                  <button 
                    disabled={isPaying}
                    onClick={() => handlePayment('full')}
                    className={`p-6 rounded-2xl border transition-all text-left group disabled:opacity-50 ${
                      isMaintenance 
                      ? 'bg-orange-600 border-orange-500 hover:bg-orange-700 w-full md:col-span-2' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <p className={`${isMaintenance ? 'text-orange-200' : 'text-slate-500'} text-[10px] font-black uppercase tracking-widest`}>
                      {isMaintenance ? 'Pagamento Mensal' : 'Totalidade (100%)'}
                    </p>
                    <p className="text-2xl font-black text-white mt-1">
                      {project.valorTotal.toFixed(2)}€
                    </p>
                    <p className={`${isMaintenance ? 'text-orange-300' : 'text-slate-400'} text-[10px] mt-4 font-bold group-hover:translate-x-1 transition-transform italic`}>
                      {isPaying ? 'A PROCESSAR...' : isMaintenance ? 'ATIVAR AGORA →' : 'PAGAR TOTAL →'}
                    </p>
                  </button>
                </div>
                
                <div className="mt-6 flex items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                  <span>🔒 Pagamento Seguro via Stripe</span>
                  <span>•</span>
                  <span>MBWay, Cartão e Apple Pay</span>
                </div>
              </div>
            </div>
          )}

          {/* Card de Progresso */}
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Estado do Site</span>
              <h2 className="text-4xl font-black text-white mt-4 mb-6">{project.projectName}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Progresso</p>
                  <p className="text-3xl font-black text-blue-500">{project.progress}%</p>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>
            <Layout className="absolute -right-8 -bottom-8 text-slate-800/20 w-64 h-64 -rotate-12" />
          </div>

          {/* Galeria de Prints */}
          <div className="glass-card p-10">
            <h3 className="text-white font-bold flex items-center gap-2 mb-8">
              <CheckCircle2 size={20} className="text-blue-500" /> Pré-visualizações
            </h3>
            {project.updates && project.updates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.updates.map((update: any, i: number) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-800">
                    <img src={update.url} alt="Update" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm italic">O André ainda não carregou imagens.</p>
            )}
          </div>
        </div>

        {/* Coluna de Mensagens */}
        <div className="space-y-8">
          <div className="glass-card p-8 flex flex-col h-full">
            <h3 className="text-white font-bold flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-emerald-500" /> Enviar Conteúdos
            </h3>
            
            <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {project.feedback?.map((f: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl text-xs ${f.sender === 'client' ? 'bg-blue-600/10 border border-blue-600/20 ml-4' : 'bg-slate-800/50 mr-4'}`}>
                  <p className="text-slate-400 mb-1 font-bold uppercase text-[8px]">{f.sender === 'client' ? 'Você' : 'André Silva'}</p>
                  <p className="text-slate-200 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <textarea 
                placeholder="Escreva aqui..."
                className="input-dark w-full h-32 pt-4 resize-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="absolute bottom-4 right-4 p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all text-white shadow-lg">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}