import express from 'express';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json()); 
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.use((_,res) => {
    res.status(404).json({ message: "This route does not exist" });
});

app.use(errorMiddleware);

export default app;