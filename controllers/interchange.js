const { Interchange, joiEditInterchangeSchema, joiPostInterchangeSchema } = require('../models/interchange');
const interchange = require('../models/interchange');
const mongoose = require('mongoose'); 

exports.getInterchanges = async (req, res) => {
    const interchanges = await Interchange.find({}); 

    if(interchanges.length === 0)
        return res.status(404).send('No interchange(s) found.'); 

    return res.status(200).json({
        data: interchanges,
        message: 'Interchange(s) fetched successfully.'
    }); 
}; 

exports.getInterchange = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send(`Bad request.`);

    const interchange = Interchange.findById(req.params.id); 

    if(!interchange)
        return res.status(400).send('Bad Request.'); 

    return res.status(200).json({
        data: interchange,
        message: 'Interchange fetched successfully'
    }); 
}

exports.postInterchange = async(req, res) => {
    console.log(req.body);
    try {
        req.body = await joiPostInterchangeSchema.validateAsync(req.body, {abortEarly: false}); 
    }catch(error){
        return res.status(400).send(error.details); 
    }

    let interchange = await Interchange.findOne({name: req.body.name}); 

    if(interchange)
        return res.status(400).send('Interchange with this name already exists.'); 

    interchange = new Interchange(req.body); 

    await interchange.save(); 

    return res.status(200).json({
        data: interchange, 
        message: 'Interchange added successfully.'
    })
}

exports.editInterchange = async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
     return res.status(400).send(`Bad request.`);

    const interchange = await Interchange.findById(req.params.id); 

    try {
        req.body = await joiEditInterchangeSchema.validateAsync(req.body, {abortEarly: false}); 
    }catch(error) {
        return res.status(400).send(error.details); 
    }

    for(let x in req.body){
        if(req.body[x])
            interchange[x] = req.body[x]; 
    }

    await interchange.save(); 

    return res.status(200).json({
        data: interchange,
        message: 'Interchange edited successfully.'
    })
}


exports.deleteInterchange = async(req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Bad request.'); 

    const interchange = await Interchange.findByIdAndDelete(req.params.id);
    
    if(!interchange)
        return res.status(400).send('Bad request.'); 

    return res.status(200).json({
        data: interchange,
        message: "Interchange deleted successfully."
    });
}