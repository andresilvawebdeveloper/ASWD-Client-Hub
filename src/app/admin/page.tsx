import { Button } from "../../components/ui/Button";
import { Plus, Folder, Users, Clock } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Clientes Ativos", value: "12", icon: <Users className="text-blue-600" /> },
    { label: "Projetos em Curso", value: "5", icon: <Folder className="text-emerald-600" /> },
    { label: "Aguardar Feedback", value: "3", icon: <Clock className="text-amber-600" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, André Silva</h1>
          <p className="text-slate-500">Bem-vindo ao centro de comando dos seus projetos.</p>
        </div>
        <Button>
          <Plus size={18} />
          Novo Projeto
        </Button>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Lista de Projetos Recentes (Placeholder) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Projetos Recentes</h2>
        </div>
        <div className="p-12 text-center">
          <p className="text-slate-400">Ainda não existem projetos ativos. Comece por criar um!</p>
        </div>
      </div>
    </div>
  );
}