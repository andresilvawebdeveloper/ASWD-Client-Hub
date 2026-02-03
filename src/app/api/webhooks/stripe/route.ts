import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../lib/firebase'; // Verifique se o caminho está correto
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
   apiVersion: '2026-01-28.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Quando o pagamento for concluído com sucesso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const projectId = session.metadata?.projectId;
    const paymentType = session.metadata?.paymentType;

    if (projectId) {
      const projectRef = doc(db, "projects", projectId);
      
      // Atualiza o status no Firebase conforme o que foi pago
      await updateDoc(projectRef, {
        status: paymentType === 'full' ? 'pago' : 'adjudicado',
        lastPaymentDate: new Date().toISOString(),
        progress: 20 // Sobe o progresso automaticamente para 20% ao pagar
      });
      
      console.log(`Projeto ${projectId} atualizado para ${paymentType}`);
    }
  }

  return NextResponse.json({ received: true });
}