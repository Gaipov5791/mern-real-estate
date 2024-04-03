import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.listen(port, () => console.log(`Server runs on port: ${port}`));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});