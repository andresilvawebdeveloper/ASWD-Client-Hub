import { NextResponse } from 'next/server';

import Stripe from 'stripe';



const stripe = process.env.STRIPE_SECRET_KEY 

  ? new Stripe(process.env.STRIPE_SECRET_KEY, {

      apiVersion: '2026-01-28.clover' as any, // Versão estável

    }) 

  : null;



export async function POST(req: Request) {

  try {

    if (!stripe) {

      console.error("ERRO: STRIPE_SECRET_KEY não encontrada.");

      return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 });

    }



    const { amount, projectName, customerEmail, projectId, paymentType } = await req.json();



    if (!amount || amount < 1) {

      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });

    }



    // Lógica Dinâmica: Detecta se é localhost ou produção automaticamente

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const baseUrl = origin.replace(/\/$/, ''); 



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

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/client`,

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