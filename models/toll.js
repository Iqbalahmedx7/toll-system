const mongoose = require('mongoose'); 
const Joi = require('joi'); 
Joi.objectId = require("joi-objectid")(Joi);

const tollSchema = new mongoose.Schema({
    interchange: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Interchange'
    },
    licensePlate: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
}); 

const joiTollEntrySchema = Joi.object({
    interchange: Joi.objectId(),
    licensePlate: Joi.string().regex(RegExp(/^[a-zA-Z]{3}[-][0-9]{3}$/)).required(),
    time: Joi.date()
}); 

const joiTollExitSchema = Joi.object({
    interchange: Joi.objectId(),
    licensePlate: Joi.string().regex(RegExp(/^[a-zA-Z]{3}[-][0-9]{3}$/)).required(),
    time: Joi.date()
});

module.exports = {
    Toll: mongoose.model('Toll', tollSchema),
    joiTollEntrySchema,
    joiTollExitSchema
}

