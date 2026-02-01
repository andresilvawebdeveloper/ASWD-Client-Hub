'use client'; // Necessário para usar hooks como useState e useRouter

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Logo } from "../../components/ui/Logo";
import { Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Autenticação no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Verificar o Cargo (Role) no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/client");
        }
      } else {
        // Se o utilizador existe no Auth mas não no Firestore, tratamos como cliente por defeito
        router.push("/client");
      }
    } catch (err: any) {
      setError("Credenciais inválidas ou erro de ligação.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#020617]">
      
      <div className="text-center mb-10 space-y-4">
        <Logo className="h-32 md:h-40 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Client Hub</h1>
          <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">
            André Silva Web Developer
          </p>
        </div>
      </div>

      <div className="w-full max-w-[400px] bg-[#0F172A] border border-slate-800 p-8 md:p-10 rounded-[2.5rem] space-y-8 shadow-xl">
        <p className="text-center text-slate-400 text-sm leading-relaxed">
          Área restrita para acompanhamento de projetos.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="input-dark w-full bg-[#1E293B] border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-600 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Palavra-passe" 
              className="input-dark w-full bg-[#1E293B] border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-600 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold rounded-2xl py-4 hover:bg-blue-500 active:scale-95 transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Entrar no Portal"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
          <Lock size={14} className="text-slate-500" />
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Acesso Encriptado
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