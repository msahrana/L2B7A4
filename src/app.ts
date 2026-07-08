import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import { authRoute } from './modules/auth/auth.route';
import { landlordRoute } from './modules/landlord/landlord.route';
import { categoryRoute } from './modules/category/category.route';
import { rentalRoute } from './modules/rentals/rental.route';
import { reviewRoute } from './modules/reviews/review.route';
import { propertyRoute } from './modules/properties/property.route';
import { adminRoute } from './modules/admin/admin.route';
import { paymentRoute } from './modules/payments/payment.route';
import { notFound } from './middleware/notFound';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { stripe } from './lib/stripe';

const app: Application = express();

app.use(
    cors({
        origin: config.APP_URL,
        credentials: true,
    }),
);

const endpointSecret = config.STRIPE_WEBHOOK_SECRET;

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.post(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
        let event = request.body;
        console.log(event, 'stripe request body');
        console.log(request.headers, 'stripe request headers');

        if (endpointSecret) {
            const signature = request.headers['stripe-signature']!;
            try {
                event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret,
                );
            } catch (err: any) {
                console.log(
                    `⚠️ Webhook signature verification failed.`,
                    err.message,
                );
                return response.status(400).json({
                    message: err.message,
                });
            }

            console.log(event, 'after try block');

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;

                    break;
                case 'payment_method.attached':
                    const paymentMethod = event.data.object;

                    break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            response.json({ received: true });
        }
    },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send(`<h2 style="
            color: black;
            background-color: cyan;
            font-size: 45px;
            text-align: center;
            padding: 20px;
        ">
            Hello, Welcome Our 
            <span style="color: yellow; ">Rent</span><span style="color: red;">Nest</span>
            Backend Server ...!
        </h2>`);
});

app.use('/api/auth', authRoute);
app.use('/api/landlord', landlordRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/properties', propertyRoute);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
