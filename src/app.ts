import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/error.middleware';
import express from 'express';
import { routes } from './routes/routes';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (_origin, callback) => callback(null, true),
    credentials: true,
  }),
);

app.use(routes);

app.use(errorMiddleware);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
