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
    const allText = JSON.stringify(answers).toLowerCase();

    // 1. Definição da Base (valores da sua tabela)
    let minBase = 300; 
    let maxBase = 600;

    if (allText.includes("loja online") || allText.includes("ecommerce") || allText.includes("vendas")) {
      minBase = 1200; maxBase = 3000;
    } else if (allText.includes("site completo") || allText.includes("institucional completo") || allText.includes("blog")) {
      minBase = 700; maxBase = 1500;
    } else if (allText.includes("simples") || allText.includes("landing")) {
      minBase = 300; maxBase = 600;
    }

    // 2. Soma de Extras (Valores médios da sua tabela)
    let extrasMin = 0;
    let extrasMax = 0;

    if (allText.includes("domínio")) { extrasMin += 8; extrasMax += 25; }
    if (allText.includes("alojamento") || allText.includes("hosting")) { extrasMin += 30; extrasMax += 120; }
    if (allText.includes("pagamento") || allText.includes("multibanco")) { extrasMin += 50; extrasMax += 200; }
    if (allText.includes("seo")) { extrasMin += 100; extrasMax += 300; }

    const totalMin = minBase + extrasMin;
    const totalMax = maxBase + extrasMax;

    // 3. Cálculo dos 4 Valores Solicitados
    const orcamentoBarato = totalMin;
    const orcamentoCaro = totalMax;
    const orcamentoJusto = Math.round((totalMin + totalMax) / 2);
    // Valor médio ponderado para ajudar a decidir (Sugestão)
    const valorSugestao = Math.round((orcamentoJusto + orcamentoCaro) / 2);

    const orcamentoDoc = {
      cliente: answers["Qual o seu nome?"] || answers["Nome"] || "Cliente",
      email: data.email || "Não fornecido",
      projeto: answers["Que tipo de projeto procuras?"] || "Web Project",
      valores: {
        barato: orcamentoBarato,
        justo: orcamentoJusto,
        caro: orcamentoCaro,
        sugestao: valorSugestao
      },
      respostas: answers,
      data: new Date().toISOString(),
      status: "analisado"
    };

    await db.collection('orcamentos').add(orcamentoDoc);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro na API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}