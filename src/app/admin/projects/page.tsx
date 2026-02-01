"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Plus, ExternalLink, Layout, Clock, CheckCircle2 } from "lucide-react";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dados fictícios para visualizarmos a estrutura
  const projects = [
    { 
      id: 1, 
      name: "E-commerce Moda Viva", 
      client: "Empresa ABC", 
      status: "Desenvolvimento", 
      staging: "https://staging.modaviva.pt",
      progress: 65 
    },
    { 
      id: 2, 
      name: "Portfolio Fotografia", 
      client: "João Silva", 
      status: "Design", 
      staging: "#",
      progress: 30 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizado": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Desenvolvimento": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Design": return "bg-purple-50 text-purple-600 border-purple-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Projetos</h1>
          <p className="text-slate-500">Acompanhe e atualize o estado dos websites em curso.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Criar Projeto
        </Button>
      </div>

      {/* Lista de Projetos em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                <Layout size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
            <p className="text-sm text-slate-400 mb-6">Cliente: {project.client}</p>

            <div className="space-y-4">
              {/* Barra de Progresso */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Progresso Geral</span>
                  <span className="text-slate-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                <a 
                  href={project.staging} 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={16} />
                  Ver Staging
                </a>
                <button className="text-xs font-medium text-slate-400 hover:text-slate-900">
                  Editar Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Criar Projeto */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Novo Projeto Web"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Projeto</label>
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Website Institucional" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar Cliente</label>
            <select className="w-full px-4 py-2 border rounded-lg bg-white">
              <option>Escolha um cliente...</option>
              <option>Empresa ABC</option>
              <option>João Silva</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Link de Staging (Opcional)</label>
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
          </div>
          <div className="pt-4">
            <Button fullWidth>Criar e Iniciar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}