'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../../components/ui/Logo';
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-300">
      <div className="max-w-md w-full text-center">
        <Logo className="h-10 mx-auto mb-12" />
        
        <div className="glass-card p-10 border-t-4 border-emerald-500 animate-in fade-in zoom-in duration-500 shadow-2xl shadow-emerald-500/10">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          
          <h1 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic">Pagamento Confirmado!</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
            Obrigado, André! O pagamento foi processado com sucesso. O estado do seu projeto já foi atualizado no portal.
          </p>

          <button 
            onClick={() => router.push('/client')}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Voltar ao meu Portal <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-600">
          <PartyPopper size={14} />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Estamos prontos para começar a próxima fase!
          </p>
        </div>
      </div>
    </main>
  );
}