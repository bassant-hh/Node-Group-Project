import express from 'express';

import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json()); 
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "This route does not exist" });
});

export default app;