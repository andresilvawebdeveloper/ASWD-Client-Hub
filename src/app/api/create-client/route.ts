import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as admin from 'firebase-admin';

// Inicializar o Resend com a tua chave de API
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Função para inicializar o Firebase Admin de forma segura.
 * Resolve erros de inicialização e trata a limpeza da chave PEM.
 */
function initAdmin() {
  if (admin.apps.length === 0) {
    try {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
      const formattedKey = rawKey
        .replace(/\\n/g, '\n') 
        .replace(/^"|"$/g, ''); 

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
      console.log("✅ Firebase Admin Inicializado");
    } catch (error: any) {
      console.error("❌ Erro ao inicializar Firebase Admin:", error.message);
      throw new Error("Falha na configuração do servidor Firebase.");
    }
  }
  return admin;
}

export async function POST(req: Request) {
  try {
    const firebaseAdmin = initAdmin();
    const { clientEmail, clientName, projectName, password } = await req.json();

    let userRecord;
    let isNewUser = false;

    try {
      // 1. Verificar se o utilizador já existe no Firebase Authentication
      userRecord = await firebaseAdmin.auth().getUserByEmail(clientEmail);
      console.log("ℹ️ Utilizador já existe no Auth. Apenas associando novo projeto.");
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // 2. Se não existir, criar a conta e o perfil no Firestore
        isNewUser = true;
        userRecord = await firebaseAdmin.auth().createUser({
          email: clientEmail,
          password: password,
          displayName: clientName,
        });

        const db = firebaseAdmin.firestore();
        await db.collection('users').doc(userRecord.uid).set({
          email: clientEmail,
          role: 'client',
          name: clientName,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("✅ Novo utilizador criado com sucesso.");
      } else {
        throw error;
      }
    }

    // 3. Preparar o Email
    const subject = isNewUser 
      ? `Bem-vindo ao Portal: ${projectName}` 
      : `Novo Projeto Adicionado: ${projectName}`;

    const emailContent = `
      <div style="font-family: sans-serif; background-color: #020617; color: white; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto;">
        <h1 style="color: #2563eb; margin-bottom: 24px;">Olá, ${clientName}!</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
          ${isNewUser 
            ? `O teu acesso ao portal para o acompanhamento do projeto <strong>${projectName}</strong> foi criado com sucesso.` 
            : `Um novo projeto foi associado à tua conta: <strong>${projectName}</strong>.`}
        </p>
        
        <div style="background-color: #0f172a; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; margin: 32px 0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Credenciais de Acesso</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${clientEmail}</p>
          ${isNewUser 
            ? `<p style="margin: 0;"><strong>Palavra-passe Temporária:</strong> <span style="color: #3b82f6; font-family: monospace;">${password}</span></p>` 
            : '<p style="margin: 0; color: #94a3b8;">Utiliza a tua palavra-passe habitual.</p>'}
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);">
             Entrar no Portal
          </a>
        </div>
        
        <p style="font-size: 11px; color: #64748b; margin-top: 40px; text-align: center; border-top: 1px solid #1e293b; padding-top: 20px;">
          André Silva Web Developer • andresilvawebdev.pt
        </p>
      </div>
    `;

    // 4. Enviar o Email via Resend usando o teu domínio oficial
    await resend.emails.send({
      from: 'André Silva <noreply@andresilvawebdev.pt>',
      to: clientEmail,
      subject: subject,
      html: emailContent,
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });

  } catch (error: any) {
    console.error("❌ Erro na API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}