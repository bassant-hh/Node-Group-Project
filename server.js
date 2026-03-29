const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json()); 
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.listen(3000, () => {
    log('Server is running on port 3000');
});


app.use((req, res, next) => {
    res.status(404).json({ message: "This route does not exist" });
});

module.exports = app;