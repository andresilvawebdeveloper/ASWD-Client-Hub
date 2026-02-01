import { Button } from "../../../components/ui/Button";
import { Plus, Search, MoreVertical, Mail } from "lucide-react";

export default function ClientsPage() {
  // Dados fictícios para visualizarmos a tabela
  const clients = [
    { id: 1, name: "Empresa ABC", email: "contato@abc.com", status: "Ativo", projects: 2 },
    { id: 2, name: "João Silva", email: "joao@design.pt", status: "Ativo", projects: 1 },
    { id: 3, name: "Restaurante Gourmet", email: "geral@gourmet.com", status: "Inativo", projects: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500">Adicione e gira os acessos dos seus clientes.</p>
        </div>
        <Button>
          <Plus size={18} />
          Adicionar Cliente
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou email..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Projetos</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{client.name}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail size={12} /> {client.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {client.projects} {client.projects === 1 ? 'Projeto' : 'Projetos'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                    <MoreVertical size={16} className="text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}