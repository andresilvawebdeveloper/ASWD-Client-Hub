import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../lib/firebase'; // Garanta que este caminho está correto
import { doc, updateDoc, increment } from 'firebase/firestore';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover' as any,
    }) 
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    console.error("Webhook: Stripe ou Secret não configurados.");
    return NextResponse.json({ error: "Configuração em falta" }, { status: 500 });
  }

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Erro na assinatura do Webhook: ${err.message}`);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  // 2. Processar o evento de sucesso no pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recuperamos os dados que guardámos no checkout
    const projectId = session.metadata?.projectId;
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    if (projectId) {
      try {
        const projectRef = doc(db, 'projects', projectId);
        
        await updateDoc(projectRef, {
          status: 'Em Desenvolvimento', // Muda o status automaticamente
          lastPaymentDate: new Date().toISOString(),
          // Se quiser somar ao total já pago:
          // totalPaid: increment(amountPaid) 
        });

        console.log(`✅ Projeto ${projectId} atualizado para pago.`);
      } catch (dbError) {
        console.error("Erro ao atualizar Firebase:", dbError);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}