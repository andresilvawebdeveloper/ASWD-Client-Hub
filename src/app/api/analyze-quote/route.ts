import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
  }
  return admin;
}

export async function POST(req: Request) {
  try {
    const firebaseAdmin = initAdmin();
    const db = firebaseAdmin.firestore();
    const data = await req.json();
    const answers = data.answers;

    // --- LÓGICA DA TUA TABELA DE PREÇOS ---
    let precoMin = 300;
    let precoMax = 600;
    const servico = JSON.stringify(answers);

    if (servico.includes("Site Completo")) { precoMin = 700; precoMax = 1500; }
    else if (servico.includes("Loja Online")) { precoMin = 1200; precoMax = 3000; }

    // Cálculo das 4 opções
    const barato = precoMin;
    const justo = (precoMin + precoMax) / 2;
    const premium = precoMax;
    const sugestao = (justo * 1.1).toFixed(0);

    const orcamentoDoc = {
      cliente: answers["Qual o seu nome?"] || "Cliente",
      email: data.email || "Não fornecido",
      servico: servico.length > 50 ? "Projeto Web" : servico,
      valores: { barato, justo, premium, sugestao },
      respostas: answers,
      data: new Date().toISOString()
    };

    await db.collection('orcamentos').add(orcamentoDoc);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return new Response("API de Orçamentos Ativa");
}