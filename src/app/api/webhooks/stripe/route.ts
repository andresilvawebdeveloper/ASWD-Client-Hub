import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// ESTA É A PARTE CRÍTICA: Inicialização segura para o build não falhar
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover' as any,
    }) 
  : null;

export async function POST(req: Request) {
  // Se o stripe for null durante o build, saímos elegantemente
  if (!stripe) {
    return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });
  }

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Faltam cabeçalhos ou segredo do webhook" }, { status: 400 });
  }

  try {
    // Aqui o Stripe já está protegido pelo "if (!stripe)" acima
    const event = stripe.webhooks.constructEvent(
      payload, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Lógica para processar o evento (ex: payment_intent.succeeded)
    // ...

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Erro no Webhook:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}