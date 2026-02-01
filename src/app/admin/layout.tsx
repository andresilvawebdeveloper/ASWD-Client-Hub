import { Sidebar } from "../../components/ui/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'flex' para colocar Sidebar e Conteúdo lado a lado
    // 'bg-[#020617]' para garantir que o fundo é escuro em todo o lado
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden">
      
      {/* Sidebar Única e Fixa */}
      <Sidebar />
      
      {/* Área onde as páginas (children) vão aparecer */}
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}