const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required',
            });
        }

        const product = await Product.create({ name, description, price, category });

        const inventory = await Inventory.create({
            product: product._id,
            stock: 0,
            reserved: 0,
            soldCount: 0,
        });

        return res.status(201).json({
            success: true,
            message: 'Product and inventory created successfully',
            data: { product, inventory },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductById };