const express = require('express');
const app = express();

app.use(express.json());

const productRoutes = require('./routes/product.routes');
const inventoryRoutes = require('./routes/inventory.routes');

app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Inventory Management API is running' });
});

module.exports = app;