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
import { favoriteRoute } from './modules/favorites/favorite.route';

const app: Application = express();

app.use(
    cors({
        origin: config.APP_URL,
        credentials: true,
    }),
);

const endpointSecret = config.STRIPE_WEBHOOK_SECRET;

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

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
app.use('/api/favorites', favoriteRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
