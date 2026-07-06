import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
// import { authRoute } from './modules/auth/auth.route';

const app: Application = express();

app.use(
    cors({
        origin: config.APP_URL,
        credentials: true,
    }),
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
            <span style="color: yellow;">Rent</span><span style="color: red;">Nest</span>
            Backend Server ...!
        </h2>`);
});

// app.use('/api/auth', authRoute);

export default app;
