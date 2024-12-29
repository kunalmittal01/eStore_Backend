import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; 
import productRouter from './routes/product.js';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
const app = express();
await mongoose.connect(process.env.mongo_url)
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']     
}));
app.use(cookieParser());
app.use(express.json());
app.use('api/v1/product', productRouter)
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.listen(process.env.port, () => {
    console.log(`Server is running at http://localhost:${process.env.port}`);
})