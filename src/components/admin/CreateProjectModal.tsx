'use client';

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, Loader2, Mail, User, Briefcase, Percent } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectName: '',
    progress: 0
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Gerar uma password temporária de 10 caracteres
    const temporaryPassword = Math.random().toString(36).slice(-10);

    try {
      // 1. Chamar a API para criar o Utilizador no Auth e enviar o Email
      // Esta API usa a tua chave do Resend que configurámos
      const apiResponse = await fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          password: temporaryPassword 
        }),
      });

      const apiData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(apiData.error || "Erro ao criar acesso do cliente");
      }

      // 2. Criar o documento do Projeto no Firestore
      await addDoc(collection(db, "projects"), {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        projectName: formData.projectName,
        progress: Number(formData.progress),
        status: 'active',
        createdAt: serverTimestamp(),
        updates: [], // Espaço para as tuas fotos de progresso
        feedback: [] // Espaço para as mensagens do cliente
      });

      alert("Sucesso! Portal ativado e email enviado para o cliente.");
      setFormData({ clientName: '', clientEmail: '', projectName: '', progress: 0 });
      onClose();
      
    } catch (error: any) {
      console.error("Erro no processo:", error);
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg p-10 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-slate-800/50">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Novo Projeto</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            Configuração de Acesso do Cliente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome do Cliente */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Nome do Cliente" 
              required 
              className="input-dark pl-12"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
          </div>

          {/* Email do Cliente */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email do Cliente" 
              required 
              className="input-dark pl-12"
              value={formData.clientEmail}
              onChange={e => setFormData({...formData, clientEmail: e.target.value})}
            />
          </div>

          {/* Nome do Projeto */}
          <div className="relative">
            <Briefcase className="absolute left-4 top-4 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Nome do Projeto (ex: Website E-commerce)" 
              required 
              className="input-dark pl-12"
              value={formData.projectName}
              onChange={e => setFormData({...formData, projectName: e.target.value})}
            />
          </div>

          {/* Progresso Inicial */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 ml-1">
              <Percent size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Progresso Inicial</span>
            </div>
            <input 
              type="number" 
              min="0" 
              max="100" 
              className="input-dark"
              value={formData.progress}
              onChange={e => setFormData({...formData, progress: Number(e.target.value)})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-premium w-full mt-4 py-4 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                <span>Ativar Portal e Notificar</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[9px] text-slate-600 mt-6 uppercase tracking-[0.1em]">
          O cliente receberá as credenciais de acesso instantaneamente.
        </p>
      </div>
    </div>
  );
};