import { Sidebar } from "../../components/ui/Sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-64"> {/* Espaço para não ficar por baixo da sidebar */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}