const {Toll, joiTollEntrySchema, joiTollExitSchema} = require('../models/toll.js');
const {Interchange} = require('../models/interchange.js');
const {DateTime} = require('luxon'); 
const {Receipt} = require('../models/receipt.js'); 


exports.entry = async (req, res) => {
  try{
    req.body = await joiTollEntrySchema.validateAsync(req.body, {abortEarly: false}); 
  }catch(error){
    return res.status(400).send(error.details); 
  }

  const interchange = await Interchange.findById(req.body.interchange); 

  if(!interchange)
    return res.status(400).send('Bad request.'); 

  let toll = await Toll.findOne({licensePlate: req.body.licensePlate}); 

  if(toll) 
    return res.status(400).send('Bad request. Duplicate license plate.');

  toll = new Toll(req.body); 

  if(!req.body.time){
      toll.time = Date.now(); 
  }

  toll.time = DateTime.fromJSDate(req.body.time); 

  await toll.save(); 

  return res.status(200).json({
    data: toll,
    message: 'Vehicle passed successfully.'
  }); 
}; 

exports.exit = async(req, res) => {
    try{
        req.body = await joiTollExitSchema.validateAsync(req.body, {abortEarly: false});
    }catch(error){
        return res.status(400).send(error.details); 
    }

    let exitInterchange = await Interchange.findById(req.body.interchange); 

    if(!exitInterchange)
        return res.status(400).send('Bad request. Interchange not found.'); 

    let toll = await Toll.findOne({licensePlate: req.body.licensePlate})
                         .populate('interchange'); 

    if(!toll)
        return res.status(400).send("Bad request. Vehicle entry not found.");
    

    if(toll.interchange == req.body.interchange)
        return res.status(400).send('Bad request. Cannot exit from the interchange you entered.');


    let receipt = new Receipt(); 
    let baseCost = 20;  
    receipt.baseRate = baseCost; 

    let costOfDistanceTraveled = 0; 
    let kmTraveled = 0; 

    exitInterchange.distance > toll.interchange.distance
                            ? kmTraveled = exitInterchange.distance - toll.interchange.distance
                            : kmTraveled = toll.interchange.distance - exitInterchange.distance; 

    costOfDistanceTraveled = 0.2 * kmTraveled; 
    receipt.distanceCost = costOfDistanceTraveled; 
    receipt.subTotal = baseCost + costOfDistanceTraveled; 

    let present = DateTime.now(); 
    let presentWeekDay = present.weekday;
    let presentMonth = present.month; 
    let presentDayOfMonth = present.day; 
    let presentYear = present.year; 
    

    //monday is 1 and sunday is 7 
    //saturday and sunday distance traveled is 1.5x
    if(presentWeekDay == 6 || presentWeekDay == 7){
        costOfDistanceTraveled *= 1.5; 
        receipt.discountOrOther = "1.5x * distance traveled"
    }

    //total so far 
    let total = baseCost; 
    total += costOfDistanceTraveled; 


    //basing on entry time so for example you only get a 50% discount on 23 March if you entered on 23rd March.
    let entryDate;

    if(!req.body.time){
        entryDate = DateTime.fromJSDate(toll.time); 
    }
    
    entryDate = DateTime.fromJSDate(req.body.time); 

    let entryYear = entryDate.year; 
    let entryMonth = entryDate.month; 
    let entryDayOfMonth = entryDate.day; 
    let entryWeekDay = entryDate.weekday; 

    if(entryYear === presentYear && entryMonth === presentMonth && entryDayOfMonth === presentDayOfMonth 
        && entryWeekDay === presentWeekDay){

            
        /*                        DISCOUNTS
        * 1.monday and wed, cars with even numbers in plate get 10% off 
        * 2.tues and thurs, cars with odd numbers in plate get 10% off
        * 3.on 23 March, 14 August & 25th December, they get 50% off
        */
        //1
        if(presentWeekDay == 1 || presentWeekDay == 3){
            let digits = Number(toll.licensePlate.split('-')[1]); 
            console.log(digits); 
            if(digits % 2 == 0){
                total -= total * 0.10; 
                receipt.discountOrOther = "10% off";
            }

        }

        //2
        if(presentWeekDay == 2 || presentWeekDay == 4){
            let digits = Number(toll.licensePlate.split('-')[1]); 

            if(digits % 2 !== 0){
                total -= total * 0.10; 
                receipt.discountOrOther = "10% off"; 
            }
            
        }


        //3
        if(presentMonth == 3 && presentDayOfMonth == 23){
            total -= total * 0.50; 
            receipt.discountOrOther = "50% off"; 
        }
        

        if(presentMonth == 8 && presentDayOfMonth == 14){
            total -= total * 0.50; 
            receipt.discountOrOther = "50% off"; 
        }

        if(presentMonth == 12 && presentDayOfMonth == 25){
            total -= total * 0.50; 
            receipt.discountOrOther = "50% off"; 
        }

    }

    receipt.grandTotal = total; 
    receipt.licensePlate = req.body.licensePlate; 
    receipt.entryInterchange = toll.interchange._id; 
    receipt.exitInterchange = req.body.interchange; 

    await receipt.save(); 

    await Toll.findByIdAndDelete(toll._id); 

    return res.status(200).json({
        data: receipt,
        message: "Receipt generated."
    }); 
}