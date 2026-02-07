import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicialização segura para TypeScript e Build da Vercel
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover' as any,
    }) 
  : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      console.error("ERRO: STRIPE_SECRET_KEY não encontrada.");
      return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });
    }

    const { amount, projectName, customerEmail, projectId, paymentType } = await req.json();

    // Verificação básica de segurança para o valor
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
    }

    // Garantir que a URL base não venha vazia
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

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
      // Limpamos possíveis barras duplas na URL
      success_url: `${baseUrl.replace(/\/$/, '')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl.replace(/\/$/, '')}/client`,
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