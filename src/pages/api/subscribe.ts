import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'

import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    //pega usuario logado por meio dos cookies
    const session = await getSession({ req });

    // busca usuario logado no fauna
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id
    if(!customerId){
      //cadastra customer no stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      // adiciona stripe_customer_id do stripe no cadastro do faunadb
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }

    //cria sessão do stripe
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1Jdn00IZM9hVvcj3bY0T5DHe', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}

export default subscribe;
