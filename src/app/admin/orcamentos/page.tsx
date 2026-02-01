'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Logo } from '../../../components/ui/Logo'; // Importando o seu componente oficial
import { Download, FileText, CheckCircle, Info } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PaginaOrcamentos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orcamentos'), orderBy('data', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleGeneratePDF = async (pedido: any, valorEscolhido: string) => {
    const element = document.getElementById(`pdf-content-${pedido.id}`);
    if (!element) return;

    // Atualiza o valor no template antes de capturar
    const valorElement = element.querySelector('.valor-final-pdf');
    if (valorElement) valorElement.textContent = `${valorEscolhido}€`;

    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Orcamento_${pedido.cliente.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      element.style.display = 'none';
    }
  };

  return (
    <div className="p-10 bg-[#020617] min-h-screen text-white">
      <div className="flex items-center gap-6 mb-12">
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
          <Logo className="h-12 w-auto" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">CENTRAL DE ORÇAMENTOS</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Análise Inteligente de Pedidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {pedidos.map((p) => (
          <div key={p.id} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-blue-500 text-xs font-black uppercase tracking-widest mb-2 block italic">Novo Pedido Recebido</span>
                <h2 className="text-3xl font-bold">{p.cliente}</h2>
                <p className="text-slate-400 font-medium">{p.projeto}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 font-mono">{new Date(p.data).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500">{p.email}</p>
              </div>
            </div>

            {/* Painel de Sugestões de Preço */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Económico', val: p.valores.barato, desc: 'Mínimo Viável', color: 'slate' },
                { label: 'Justo', val: p.valores.justo, desc: 'Equilibrado', color: 'blue' },
                { label: 'Premium', val: p.valores.caro, desc: 'Completo', color: 'purple' },
                { label: 'Sugestão ASWD', val: p.valores.sugestao, desc: 'Valor Ideal', color: 'green' }
              ].map((opt) => (
                <button 
                  key={opt.label}
                  onClick={() => handleGeneratePDF(p, opt.val)}
                  className={`p-6 rounded-2xl border text-left transition-all hover:ring-2 hover:ring-blue-500 group/btn
                    ${opt.color === 'green' ? 'bg-green-600/10 border-green-500/30' : 'bg-slate-900/40 border-slate-800'}`}
                >
                  <p className="text-[10px] uppercase font-black text-slate-500 group-hover/btn:text-blue-400 transition-colors">{opt.label}</p>
                  <p className={`text-3xl font-black my-1 ${opt.color === 'green' ? 'text-green-400' : 'text-white'}`}>{opt.val}€</p>
                  <p className="text-[10px] text-slate-600 font-bold">{opt.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-blue-500 opacity-0 group-hover/btn:opacity-100 transition-all transform translate-y-2 group-hover/btn:translate-y-0">
                    <Download size={14} /> GERAR ORÇAMENTO
                  </div>
                </button>
              ))}
            </div>

            {/* Detalhes do Formulário para análise */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/50">
               <div className="flex items-center gap-2 mb-4 text-slate-400">
                 <Info size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">Resumo das Respostas</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(p.respostas).map(([pergunta, resposta]: any) => (
                    <div key={pergunta} className="border-b border-slate-800 pb-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{pergunta}</p>
                      <p className="text-sm text-slate-300">{resposta.toString()}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* TEMPLATE DO PDF (Fica invisível na página) */}
            <div id={`pdf-content-${p.id}`} style={{ 
              display: 'none', width: '210mm', padding: '25mm', backgroundColor: 'white', color: '#1e293b', fontFamily: 'Helvetica, Arial, sans-serif' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #2563eb', paddingBottom: '20px', marginBottom: '30px' }}>
                <div style={{ filter: 'grayscale(100%)' }}>
                   {/* O PDF usará a versão preta e branca do seu logo para impressão */}
                   <Logo className="h-16 w-auto" />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ margin: 0, color: '#2563eb', fontSize: '28px', fontWeight: '900' }}>ORÇAMENTO DE PROJETO</h1>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>REF: {p.id.substring(0,8).toUpperCase()}</p>
                  <p style={{ margin: 0, fontSize: '12px' }}>DATA: {new Date().toLocaleDateString('pt-PT')}</p>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Dados do Cliente</h3>
                <p style={{ margin: '10px 0 5px 0' }}><strong>NOME:</strong> {p.cliente}</p>
                <p style={{ margin: '0' }}><strong>EMAIL:</strong> {p.email}</p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Descrição do Serviço</h3>
                <p style={{ margin: '10px 0', fontSize: '15px', lineHeight: '1.6' }}>
                  Desenvolvimento personalizado de <strong>{p.projeto}</strong>. Este orçamento inclui design responsivo, 
                  otimização de performance, e as funcionalidades especificadas no levantamento de requisitos.
                </p>
                
                <div style={{ marginTop: '15px', fontSize: '13px' }}>
                   <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Detalhes Técnicos Analisados:</p>
                   <ul style={{ paddingLeft: '20px' }}>
                      {Object.entries(p.respostas).slice(0, 5).map(([q, a]: any) => (
                        <li key={q} style={{ marginBottom: '3px' }}>{q}: {a.toString()}</li>
                      ))}
                   </ul>
                </div>
              </div>

              <div style={{ marginTop: '50px', backgroundColor: '#f1f5f9', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Investimento Total Estimado</p>
                <h1 className="valor-final-pdf" style={{ margin: '10px 0 0 0', fontSize: '54px', fontWeight: '900', color: '#0f172a' }}>
                  {p.valores.sugestao}€
                </h1>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Pagamento: 50% adjudicação / 50% conclusão</p>
              </div>

              <div style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                <p style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>André Silva - Web Developer</p>
                <p>www.andresilvawebdev.pt • Proposta válida por 15 dias</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}