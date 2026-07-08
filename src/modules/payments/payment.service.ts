import { prisma } from '../../lib/prisma';
import { stripe } from '../../lib/stripe';
import config from '../../config';

const createCheckoutSessionIntoDB = async (rentalRequestId: string) => {
    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: rentalRequestId,
        },
        include: {
            tenant: true,
            property: true,
            payment: true,
        },
    });

    let stripeCustomerId = rentalRequest.payment?.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: rentalRequest.tenant.email,
            name: rentalRequest.tenant.name,
            metadata: {
                userId: rentalRequest.tenant.id,
                rentalRequestId: rentalRequest.id,
            },
        });

        stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: stripeCustomerId,
        payment_method_types: ['card'],

        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: rentalRequest.property.title,
                        description: rentalRequest.property.location,
                    },
                    unit_amount: Math.round(rentalRequest.property.rent * 100),
                },
                quantity: 1,
            },
        ],

        success_url: `${config.APP_URL}/payment-success`,
        cancel_url: `${config.APP_URL}/payment-cancel`,

        metadata: {
            rentalRequestId: rentalRequest.id,
            userId: rentalRequest.tenant.id,
        },
    });

    return {
        paymentUrl: session.url,
    };
};

const handleWebhookIntoDB = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.STRIPE_WEBHOOK_SECRET;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
    );

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            break;

        case 'customer.subscription.updated':
            break;

        case 'customer.subscription.deleted':
            break;

        default:
            console.log(`No event matched. Unhandled event type ${event.type}`);
            break;
    }
};

export const paymentService = {
    createCheckoutSessionIntoDB,
    handleWebhookIntoDB,
};
