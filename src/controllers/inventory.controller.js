const Inventory = require('../models/inventory.model');

const getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        return res.status(200).json({ success: true, count: inventories.length, data: inventories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }
        return res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ success: false, message: 'Product and quantity required' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be > 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        inventory.stock += quantity;
        await inventory.save();
        await inventory.populate('product');

        return res.status(200).json({
            success: true,
            message: `Added ${quantity} to stock`,
            data: inventory,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ success: false, message: 'Product and quantity required' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be > 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Not enough stock. Current: ${inventory.stock}`,
            });
        }

        inventory.stock -= quantity;
        await inventory.save();
        await inventory.populate('product');

        return res.status(200).json({
            success: true,
            message: `Removed ${quantity} from stock`,
            data: inventory,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const reservation = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ success: false, message: 'Product and quantity required' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be > 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Not enough stock to reserve. Current: ${inventory.stock}`,
            });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        await inventory.populate('product');

        return res.status(200).json({
            success: true,
            message: `Reserved ${quantity} units`,
            data: inventory,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ success: false, message: 'Product and quantity required' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be > 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        if (inventory.reserved < quantity) {
            return res.status(400).json({
                success: false,
                message: `Not enough reserved. Current: ${inventory.reserved}`,
            });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        await inventory.populate('product');

        return res.status(200).json({
            success: true,
            message: `Sold ${quantity} units`,
            data: inventory,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllInventories, getInventoryById, addStock, removeStock, reservation, sold };