'use client';

import { useEffect, useState, Suspense } from 'react';
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
  Wrench,
  Globe,
  ArrowRight
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ClientPortal() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      // SE FOR VOCÊ (ADMIN), ELE TRAZ O ÚLTIMO PROJETO CRIADO PARA TESTE
      // SE FOR CLIENTE, TRAZ APENAS O DELE
      const isAdmin = user.email === "O_SEU_EMAIL_DE_ADMIN@exemplo.com"; // SUBSTITUA PELO SEU EMAIL
      
      const q = isAdmin 
        ? query(collection(db, "projects")) 
        : query(collection(db, "projects"), where("clientEmail", "==", user.email));

      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          // No caso de admin, pegamos o primeiro da lista para visualizar
          setProject({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setProject(null);
        }
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, [router]);

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
      console.error("Erro no checkout:", err);
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
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="animate-pulse text-blue-500 font-black tracking-widest uppercase text-xs">A carregar portal...</div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <Logo className="h-20 mb-8 opacity-20" />
      <h1 className="text-white font-black text-2xl uppercase tracking-tighter">Nenhum projeto associado.</h1>
      <p className="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
        Não encontrámos nenhum projeto para o e-mail: <br/>
        <span className="text-blue-400 font-bold">{auth.currentUser?.email}</span>
      </p>
      <button onClick={handleLogout} className="mt-12 px-8 py-3 bg-slate-900 text-slate-400 rounded-full flex items-center gap-2 hover:bg-slate-800 transition-all text-xs font-bold uppercase">
        <LogOut size={16} /> Terminar Sessão
      </button>
    </div>
  );

  const isMaintenance = project.category === 'Manutenção';

  return (
    <main className="min-h-screen bg-[#020617] p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <Logo className="h-12" />
        <div className="flex items-center gap-6 bg-slate-900/40 p-2 pl-6 rounded-2xl border border-slate-800/50">
          <div className="text-right">
            <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.3em]">Cliente Ativo</p>
            <p className="text-white font-bold text-sm">{project.clientName}</p>
          </div>
          <button onClick={handleLogout} className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECÇÃO DE PAGAMENTO */}
          {project.status !== 'Em Desenvolvimento' && project.status !== 'pago' && (
            <div className={`glass-card p-10 border-l-4 ${isMaintenance ? 'border-orange-500 bg-orange-500/5' : 'border-blue-500 bg-blue-500/5'} relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700`}>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-white font-black text-2xl uppercase tracking-tight flex items-center gap-3">
                      {isMaintenance ? <Wrench className="text-orange-500" /> : <CreditCard className="text-blue-500" />} 
                      {isMaintenance ? 'Ativar Manutenção' : 'Adjudicação do Projeto'}
                    </h3>
                  </div>
                  <ShieldCheck size={40} className="text-slate-800/30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isMaintenance && (
                    <button disabled={isPaying} onClick={() => handlePayment('deposit')} className="p-8 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all text-left group disabled:opacity-50">
                      <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Sinal (50%)</p>
                      <p className="text-3xl font-black text-white mt-1">{(project.valorTotal / 2).toFixed(2)}€</p>
                      <p className="text-blue-300 text-[10px] mt-6 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        {isPaying ? 'A ligar ao Stripe...' : 'Pagar Adjudicação'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </button>
                  )}

                  <button 
                    disabled={isPaying} 
                    onClick={() => handlePayment('full')} 
                    className={`p-8 rounded-2xl border transition-all text-left group disabled:opacity-50 ${
                      isMaintenance ? 'bg-orange-600 border-orange-500 hover:bg-orange-500 w-full md:col-span-2' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <p className={`${isMaintenance ? 'text-orange-200' : 'text-slate-500'} text-[10px] font-black uppercase tracking-widest`}>
                      {isMaintenance ? 'Subscrição Mensal' : 'Totalidade'}
                    </p>
                    <p className="text-3xl font-black text-white mt-1">{project.valorTotal.toFixed(2)}€</p>
                    <p className={`${isMaintenance ? 'text-orange-300' : 'text-slate-400'} text-[10px] mt-6 font-bold flex items-center gap-2 uppercase tracking-tighter italic`}>
                      {isPaying ? 'Processando...' : 'Pagar Agora'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CARD DE PROGRESSO */}
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-500/20">Progresso Atual</span>
              <h2 className="text-4xl font-black text-white mt-6 mb-10 tracking-tighter">{project.projectName}</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Status: <span className="text-white">{project.status}</span></p>
                  <p className="text-4xl font-black text-blue-500 italic">{project.progress}%</p>
                </div>
                <div className="w-full h-4 bg-slate-900/80 rounded-full border border-slate-800 overflow-hidden p-1">
                  <div className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.4)]" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>
            <Layout className="absolute -right-12 -bottom-12 text-slate-800/10 w-80 h-80 -rotate-12" />
          </div>

          {/* GALERIA */}
          <div className="glass-card p-10">
            <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3 mb-10">
              <Globe size={18} className="text-blue-500" /> Pré-visualizações do Projeto
            </h3>
            {project.updates && project.updates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.updates.map((update: any, i: number) => (
                  <div key={i} className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-2xl">
                    <img src={update.url} alt="Update" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-800/50 rounded-3xl">
                <p className="text-slate-600 text-sm italic font-medium uppercase tracking-widest">A aguardar os primeiros prints...</p>
              </div>
            )}
          </div>
        </div>

        {/* MENSAGENS */}
        <div className="space-y-8">
          <div className="glass-card p-8 flex flex-col h-[700px] border-t-4 border-t-emerald-500/50">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 mb-8">
              <MessageSquare size={16} className="text-emerald-500" /> Central de Conteúdo
            </h3>
            
            <div className="flex-1 space-y-6 mb-8 overflow-y-auto pr-2 custom-scrollbar">
              {project.feedback?.map((f: any, i: number) => (
                <div key={i} className={`flex flex-col ${f.sender === 'client' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-xs leading-relaxed ${
                    f.sender === 'client' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-300 rounded-tl-none border border-slate-700'
                  }`}>
                    <p>{f.text}</p>
                  </div>
                  <span className="text-[8px] text-slate-600 font-bold uppercase mt-2 tracking-widest">
                    {f.sender === 'client' ? 'Enviado por si' : 'André Silva'}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="relative mt-auto">
              <textarea 
                placeholder="Envie links, textos ou dúvidas..."
                className="input-dark w-full h-40 pt-5 px-6 resize-none text-sm rounded-3xl border-slate-800 focus:border-emerald-500/50 transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="absolute bottom-4 right-4 p-4 bg-emerald-600 rounded-2xl hover:bg-emerald-500 transition-all text-white shadow-xl hover:shadow-emerald-500/20 active:scale-95">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}