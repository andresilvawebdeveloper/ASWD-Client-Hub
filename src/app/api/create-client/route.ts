import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as admin from 'firebase-admin';

// 1. Inicializar o Resend com a tua chave
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Função para inicializar o Firebase Admin de forma segura.
 * Resolve o erro "The default Firebase app does not exist".
 */
function initAdmin() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Importante: trata as quebras de linha da chave privada
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log("✅ Firebase Admin Inicializado com sucesso.");
    } catch (error: any) {
      console.error("❌ Erro ao inicializar Firebase Admin:", error.message);
      throw new Error("Falha na configuração do servidor Firebase.");
    }
  }
  return admin;
}

export async function POST(req: Request) {
  try {
    // Garantir que o Admin está pronto
    const firebaseAdmin = initAdmin();
    
    // Obter dados do formulário
    const { clientEmail, clientName, projectName, password } = await req.json();

    console.log(`🚀 A iniciar criação para: ${clientEmail}`);

    // 1. Criar o utilizador no Firebase Authentication
    const userRecord = await firebaseAdmin.auth().createUser({
      email: clientEmail,
      password: password,
      displayName: clientName,
    });

    // 2. Criar o perfil do utilizador no Firestore (Coleção 'users')
    // Isto é vital para que o nosso sistema de login saiba que ele é um 'client'
    const db = firebaseAdmin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      email: clientEmail,
      name: clientName,
      role: 'client',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 3. Enviar o email de boas-vindas via Resend
    const emailResponse = await resend.emails.send({
      from: 'ASWD Hub <onboarding@resend.dev>', // No futuro, altera para o teu domínio
      to: clientEmail,
      subject: `Acesso ao Portal: ${projectName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; border-radius: 24px;">
          <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin-bottom: 16px;">Olá, ${clientName}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            O teu portal de acompanhamento para o projeto <strong>${projectName}</strong> já está ativo e pronto a usar.
          </p>
          
          <div style="background-color: #0f172a; padding: 32px; border-radius: 16px; border: 1px solid #1e293b; margin: 32px 0;">
            <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Dados de Acesso</p>
            <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Email:</strong> ${clientEmail}</p>
            <p style="margin: 0; font-size: 16px;"><strong>Palavra-passe:</strong> <span style="color: #3b82f6; font-family: monospace;">${password}</span></p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
               style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);">
               Entrar no Portal
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 40px 0;">
          <p style="font-size: 10px; color: #475569; text-align: center; text-transform: uppercase; letter-spacing: 3px;">
            André Silva Web Developer © 2026
          </p>
        </div>
      `,
    });

    console.log("✅ Processo concluído com sucesso!");
    return NextResponse.json({ success: true, id: userRecord.uid });

  } catch (error: any) {
    console.error("❌ Erro detalhado na API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" }, 
      { status: 500 }
    );
  }
}