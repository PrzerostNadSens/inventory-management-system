import connectDB from './config/db';
import dotenv from 'dotenv';
import errorHandler from './utils/errorHandler';
import express from 'express';
import { routes } from './routes/routes';

dotenv.config();

const app = express();

app.use(routes);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
