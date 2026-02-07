import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicialização segura: não usamos o "!" para evitar erro de build na Vercel
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover', // Use uma versão estável reconhecida pelo SDK
    }) 
  : null;

export async function POST(req) {
  try {
    // Se o stripe for null, significa que a chave não foi lida corretamente
    if (!stripe) {
      throw new Error("STRIPE_SECRET_KEY não configurada nas variáveis de ambiente.");
    }

    const { amount, projectName, customerEmail, projectId, paymentType } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'multibanco'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${projectName} - ${paymentType === 'deposit' ? 'Adjudicação (50%)' : 'Pagamento Total'}`,
              description: `Serviço de Desenvolvimento Web - André Silva WebDev`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/client`,
      metadata: {
        projectId,
        paymentType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erro no Stripe:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


