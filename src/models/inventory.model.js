const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
            unique: true,
        },
        stock: {
            type: Number,
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        reserved: {
            type: Number,
            min: [0, 'Reserved cannot be negative'],
            default: 0,
        },
        soldCount: {
            type: Number,
            min: [0, 'Sold count cannot be negative'],
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);