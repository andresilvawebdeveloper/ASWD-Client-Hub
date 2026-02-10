'use client';

import { useState } from 'react';
import { Logo } from '../../components/ui/Logo';
import { ChevronLeft, ShieldCheck, FileText, Scale, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Botão Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-blue-500 mb-12 transition-all uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Voltar ao Início
        </Link>
        
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <Logo className="h-10" />
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setTab('terms')} 
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                tab === 'terms' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Termos de Serviço
            </button>
            <button 
              onClick={() => setTab('privacy')} 
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                tab === 'privacy' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Privacidade (RGPD)
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="glass-card p-8 md:p-12 border border-slate-800/50 leading-relaxed text-sm shadow-2xl">
          {tab === 'terms' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <FileText className="text-blue-500" size={20} /> 1. Prazos e Entrega
                </h2>
                <p className="text-slate-400">
                  Os prazos de execução são estimados individualmente para cada projeto. 
                  O início da contagem ocorre após a receção de todos os conteúdos necessários 
                  (textos, imagens e logótipos). Atrasos na entrega de materiais pelo cliente suspendem o prazo acordado.
                </p>
              </section>

              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <Scale className="text-blue-500" size={20} /> 2. Política de Reembolso
                </h2>
                <p className="text-slate-400">
                  O valor de adjudicação (50%) destina-se à reserva de agenda e custos iniciais de planeamento. 
                  Após a apresentação da primeira proposta de design ou início do desenvolvimento, este valor não é reembolsável.
                </p>
              </section>

              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <ShieldCheck className="text-blue-500" size={20} /> 3. Propriedade Intelectual
                </h2>
                <p className="text-slate-400">
                  A propriedade plena do código-fonte e ficheiros de design é transferida para o cliente 
                  apenas após a liquidação total (100%) do valor total do projeto acordado.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <ShieldCheck className="text-emerald-500" size={20} /> Tratamento de Dados
                </h2>
                <p className="text-slate-400">
                  Os seus dados (nome e e-mail) são recolhidos exclusivamente para permitir o acesso ao 
                  Portal do Cliente e gestão do projeto. Os dados são armazenados de forma segura via Google Firebase. 
                  Não partilhamos dados com terceiros para fins de marketing.
                </p>
              </section>

              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <CreditCard className="text-emerald-500" size={20} /> Segurança de Pagamento
                </h2>
                <p className="text-slate-400">
                  Todos os pagamentos são processados de forma segura através da plataforma Stripe. 
                  André Silva WebDev não armazena nem tem acesso aos dados dos seus cartões de crédito 
                  ou outros métodos de pagamento sensíveis.
                </p>
              </section>

              <section>
                <h2 className="text-white font-black text-lg flex items-center gap-3 mb-4 uppercase tracking-tighter italic">
                  <FileText className="text-emerald-500" size={20} /> Retenção de Dados
                </h2>
                <p className="text-slate-400">
                  Os dados do projeto e feedback serão mantidos enquanto o serviço estiver ativo. 
                  Pode solicitar a eliminação dos seus dados a qualquer momento entrando em contacto direto.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Rodapé Interno da Página */}
        <p className="mt-12 text-center text-[8px] font-bold text-slate-600 uppercase tracking-[0.5em]">
          André Silva WebDev • Última atualização: 2026
        </p>
      </div>
    </main>
  );
}