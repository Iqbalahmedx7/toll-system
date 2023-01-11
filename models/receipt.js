const mongoose = require('mongoose'); 

const receiptSchema = new mongoose.Schema({
    baseRate: {
        type: Number,
        required: true
    },
    distanceCost: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    discountOrOther: {
        type: String
    },
    grandTotal: {
        type: Number,
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },
    entryInterchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interchange',
        required: true
    },
    exitInterchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interchange',
        required: true
    }
}); 

module.exports = {
    Receipt: mongoose.model('Receipt', receiptSchema)
}