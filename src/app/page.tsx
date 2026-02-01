import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import Link from "next/link";

export default function RootPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-8">
        <Logo className="h-16 w-auto mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">ASWD Client Hub</h1>
          <p className="text-slate-500">
            A sua plataforma exclusiva para acompanhamento de projetos web.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <Link href="/login">
            <Button fullWidth>Aceder à Minha Área</Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Assinatura Digital: <span className="font-semibold">André Silva Web Developer</span>
        </p>
      </div>
    </main>
  );
}