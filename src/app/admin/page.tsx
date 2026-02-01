import { Logo } from "../../components/ui/Logo";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const projects = [
    { client: "Clínica Premium", type: "Website", progress: 75, status: "Development" },
    { client: "Café Central", type: "Landing Page", progress: 100, status: "Finished" },
    { client: "Imobiliária Lux", type: "Portal", progress: 15, status: "Design" },
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navbar Admin */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo className="h-10" />
            <span className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full uppercase border border-blue-600/30">
              Admin Panel
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Plus size={18} /> Novo Projeto
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Clientes</p>
            <p className="text-3xl font-black mt-1">03</p>
          </div>
          <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sites em Curso</p>
            <p className="text-3xl font-black mt-1 text-blue-500">02</p>
          </div>
        </div>

        {/* Tabela de Gestão */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                <th className="p-6">Cliente</th>
                <th className="p-6">Progresso</th>
                <th className="p-6">Estado</th>
                <th className="p-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((p, i) => (
                <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-6 italic font-bold text-white">{p.client}</td>
                  <td className="p-6 w-1/3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase ${
                      p.progress === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-3">
                      <button className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-all"><Edit2 size={16}/></button>
                      <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}