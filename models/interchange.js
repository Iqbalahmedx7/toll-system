const mongoose = require('mongoose'); 
const Joi = require('joi'); 

const interchangeSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    }, 
    distance: {
        type: Number, 
        required: true
    },
    distanceUnit: {
        type: String,
        required: true
    }
});

const joiEditInterchangeSchema = Joi.object({
    name: Joi.string().lowercase().trim().max(50),
    distance: Joi.number(), 
    distanceUnit: Joi.string().valid('KM').uppercase()
})

const joiPostInterchangeSchema = Joi.object({
    name: Joi.string().lowercase().trim().max(50).required(),
    distance: Joi.number().required(), 
    distanceUnit: Joi.string().valid('KM').uppercase().required()
})

module.exports = {
    Interchange: mongoose.model('Interchange', interchangeSchema),
    joiEditInterchangeSchema, 
    joiPostInterchangeSchema
}