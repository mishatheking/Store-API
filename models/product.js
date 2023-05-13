const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"product name must be provided"],
    },
    price: {
        type: Number,
        required: [true,"product price must be provided"],
    },
    featured: {
        type: Boolean,
        dafault:false,
    },
    rating: {
        type: Number,
        dafault: 4.5,
    },
    createdAt: {
        type: Date,
        dafault: Date.now(),
    },
    company: {
        type: String,
        enum: { 
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported',
        },
        // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
})

module.exports = mongoose.model('Product', productSchema);