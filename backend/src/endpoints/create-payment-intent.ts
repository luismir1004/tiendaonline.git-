import { PayloadHandler } from 'payload'
import Stripe from 'stripe'

// Initialized lazily inside handler to prevent build/startup errors if env var is missing
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', ...)

export const createPaymentIntent: PayloadHandler = async (req): Promise<Response> => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return Response.json({ error: 'Stripe Secret Key not found' }, { status: 500 })
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-08-27.basil',
        })

        // Validar que req.json existe
        if (!req.json) {
            return Response.json({ error: 'Invalid request format' }, { status: 400 })
        }

        const body = await req.json()
        const { items } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return Response.json({ error: 'Invalid items data' }, { status: 400 })
        }

        // Validar que cada item tenga price y quantity válidos
        const invalidItem = items.find((item: any) =>
            !item.price || typeof item.price !== 'number' || item.price <= 0 ||
            !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0
        )
        if (invalidItem) {
            return Response.json({ error: 'Invalid item data: price and quantity must be positive numbers' }, { status: 400 })
        }

        // In a real app, calculate price securely from DB using item IDs.
        // For this MVP/Demo, we will calculate based on the passed price 
        // BUT we should verify in a production env.
        // Assuming items have { price, quantity }

        const amount = items.reduce((total: number, item: any) => {
            // Price is in dollars, Stripe expects cents
            return total + Math.round(item.price * 100) * item.quantity
        }, 0)

        // Validar que el monto total sea válido (mínimo 1 centavo para USD)
        if (amount < 1) {
            return Response.json({ error: 'Total amount must be at least $0.01' }, { status: 400 })
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return Response.json({
            clientSecret: paymentIntent.client_secret,
        })

    } catch (error: any) {
        console.error('Error creating payment intent:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
