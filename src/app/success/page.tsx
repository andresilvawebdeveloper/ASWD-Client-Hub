'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '../../components/ui/Logo';
import { CheckCircle2, ArrowRight, MessageSquare, Globe } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti'; // Opcional: npm install canvas-confetti

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Lança confetis para celebrar o pagamento bem-sucedido
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#ffffff']
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* Ícone de Sucesso Animado */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-full">
              <CheckCircle2 size={60} className="text-emerald-500 animate-bounce" />
            </div>
          </div>
        </div>

        <Logo className="h-12 mx-auto mb-8" />
        
        <h1 className="text-3xl font-black text-white mb-4">Pagamento Confirmado!</h1>
        <p className="text-slate-400 leading-relaxed mb-12">
          Obrigado pela sua confiança. O seu pagamento foi processado com sucesso e o projeto já foi atualizado no nosso sistema.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-12">
          <div className="glass-card p-6 flex items-start gap-4 text-left border-l-2 border-l-blue-500">
            <Globe className="text-blue-500 shrink-0" size={20} />
            <div>
              <p className="text-white text-sm font-bold">O que acontece agora?</p>
              <p className="text-slate-500 text-xs mt-1">Vou analisar o seu pedido e dar seguimento ao desenvolvimento de imediato.</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4 text-left border-l-2 border-l-emerald-500">
            <MessageSquare className="text-emerald-500 shrink-0" size={20} />
            <div>
              <p className="text-white text-sm font-bold">Feedback em Tempo Real</p>
              <p className="text-slate-500 text-xs mt-1">Pode acompanhar o progresso e trocar mensagens comigo através do seu portal.</p>
            </div>
          </div>
        </div>

        <Link 
          href="/client" 
          className="group w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
        >
          VOLTAR AO MEU PORTAL <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
          ID da Transação: {sessionId?.slice(0, 12)}...
        </p>
      </div>
    </div>
  );
}