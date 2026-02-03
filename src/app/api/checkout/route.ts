import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', // Versão estável
});

export async function POST(req: Request) {
  try {
    const { amount, projectName, customerEmail, projectId, paymentType } = await req.json();

    // Cria a sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'multibanco'], // Adiciona Multibanco (MBWay é automático via Card/Google Pay em PT)
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${projectName} - ${paymentType === 'deposit' ? 'Adjudicação (50%)' : 'Pagamento Total'}`,
              description: `Serviço de Desenvolvimento Web - André Silva WebDev`,
            },
            unit_amount: Math.round(amount * 100), // O Stripe conta em cêntimos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL}/admin/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/admin/dashboard?canceled=true`,
      metadata: {
        projectId,
        paymentType, // 'deposit' ou 'full'
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}