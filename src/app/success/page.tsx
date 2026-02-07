'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Logo } from '../../components/ui/Logo';
import { CheckCircle2, ArrowRight, MessageSquare, Globe } from 'lucide-react';
import Link from 'next/link';

// 1. Criamos um componente interno para a lógica do ID
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
      ID da Transação: {sessionId?.slice(0, 12)}...
    </p>
  );
}

// 2. O componente principal agora usa o <Suspense>
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        <div className="mb-8 flex justify-center">
          <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-full">
            <CheckCircle2 size={60} className="text-emerald-500" />
          </div>
        </div>

        <Logo className="h-12 mx-auto mb-8" />
        
        <h1 className="text-3xl font-black text-white mb-4">Pagamento Confirmado!</h1>
        <p className="text-slate-400 leading-relaxed mb-12">
          Obrigado pela sua confiança. O seu pagamento foi processado com sucesso.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-12 text-left">
          <div className="glass-card p-6 border-l-2 border-l-blue-500">
             <p className="text-white text-sm font-bold flex items-center gap-2">
                <Globe size={16} className="text-blue-500" /> O que acontece agora?
             </p>
             <p className="text-slate-500 text-xs mt-1">O projeto já foi atualizado e o desenvolvimento continua.</p>
          </div>
        </div>

        <Link 
          href="/client" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          VOLTAR AO MEU PORTAL <ArrowRight size={18} />
        </Link>
        
        {/* ENVOLVEMOS A LÓGICA NO SUSPENSE AQUI */}
        <Suspense fallback={<p className="mt-8 text-[10px] text-slate-600 italic">A carregar detalhes...</p>}>
          <SuccessContent />
        </Suspense>

      </div>
    </div>
  );
}