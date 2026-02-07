import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicialização segura para TypeScript e Build da Vercel
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover' as any, // "as any" evita conflitos de versão no TS
    }) 
  : null;

export async function POST(req: Request) {
  try {
    // Verificação de segurança
    if (!stripe) {
      console.error("ERRO: STRIPE_SECRET_KEY não encontrada no ambiente.");
      return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });
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
  } catch (err: any) {
    console.error('Erro no Stripe:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}