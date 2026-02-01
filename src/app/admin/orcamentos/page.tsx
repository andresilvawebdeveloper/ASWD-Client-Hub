'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // Verifique o seu caminho do firebase client

export default function ListaOrcamentos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orcamentos'), orderBy('data', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#020617', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ color: '#2563eb' }}>Análise de Orçamentos</h1>
      <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
        {pedidos.map((p) => (
          <div key={p.id} style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h3>{p.cliente}</h3>
            <p>Projeto: {p.servico}</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <div style={{ color: '#94a3b8' }}>Barato: <strong>{p.valores.barato}€</strong></div>
              <div style={{ color: '#3b82f6' }}>Justo: <strong>{p.valores.justo}€</strong></div>
              <div style={{ color: '#a855f7' }}>Premium: <strong>{p.valores.premium}€</strong></div>
              <div style={{ color: '#22c55e' }}>Sugestão André: <strong>{p.valores.sugestao}€</strong></div>
            </div>
            <button style={{ marginTop: '20px', background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
              Gerar PDF com este valor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}