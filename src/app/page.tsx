'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Logo } from "../components/ui/Logo";
import { Lock, Loader2 } from "lucide-react";

export default function RootPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log("--- Início do Processo de Login ---");

    try {
      // 1. Tenta Autenticar
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("1. Autenticação com sucesso! UID:", user.uid);

      // 2. Tenta ler o Firestore
      console.log("2. A procurar documento na coleção 'users'...");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("3. Documento encontrado! Dados:", userData);

        if (userData.role === 'admin') {
          console.log("4. Utilizador é Admin. A redirecionar para /admin...");
          router.push("/admin");
        } else {
          console.log("4. Utilizador é Cliente. A redirecionar para /client...");
          router.push("/client");
        }
      } else {
        console.warn("3. Documento não encontrado no Firestore para este UID.");
        setError("Erro: Perfil de utilizador não configurado na base de dados.");
      }
    } catch (err: any) {
      console.error("ERRO DETALHADO:", err.code, err.message);
      setError("Email ou palavra-passe incorretos.");
    } finally {
      setLoading(false);
      console.log("--- Fim do Processo ---");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#020617]">
      
      <div className="text-center mb-12 space-y-6">
        <Logo className="h-32 md:h-40 mx-auto" /> 
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Client Hub</h1>
          <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">
            André Silva Web Developer
          </p>
        </div>
      </div>

      <div className="w-full max-w-[400px] glass-card p-8 md:p-10 rounded-[2.5rem] space-y-8">
        <p className="text-center text-slate-400 text-sm leading-relaxed">
          Faça login para gerir os seus projetos, enviar conteúdos e acompanhar o progresso em tempo real.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="input-dark w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Palavra-passe" 
            className="input-dark w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-glow text-lg w-full flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar no Portal"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
          <Lock size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Acesso Seguro
          </span>
        </div>
      </div>

      <footer className="mt-16">
        <p className="text-[10px] text-slate-800 font-bold uppercase tracking-[0.4em]">
          ASWD © 2026
        </p>
      </footer>
    </main>
  );
}