"use client"; // Necessário para usar o estado (useState) do React

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Plus, Search, MoreVertical, Mail } from "lucide-react";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... (mantenha a lista de clientes fictícia que enviamos antes)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500">Adicione e gira os acessos dos seus clientes.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Adicionar Cliente
        </Button>
      </div>

      {/* Tabela e Busca (Mantenha o código anterior aqui) */}

      {/* Modal para Adicionar Cliente */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Novo Cliente"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome Completo / Empresa</label>
            <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/10" placeholder="Ex: André Silva Web Dev" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email de Acesso</label>
            <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/10" placeholder="cliente@email.com" />
          </div>
          <div className="pt-4 flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button fullWidth>Guardar Cliente</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
