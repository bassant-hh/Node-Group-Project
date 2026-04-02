import express from 'express';
import { rateLimit } from 'express-rate-limit';

import { errorMiddleware } from './middleware/errorMiddleware.js';

//Rate Limit Configuration
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: true
});

import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json());
app.use(rateLimitMiddleware);

app.use(errorMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.use((_,res) => {
    res.status(404).json({ message: "This route does not exist" });
});

app.use(errorMiddleware);

export default app;