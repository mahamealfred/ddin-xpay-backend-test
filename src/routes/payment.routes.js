const express =require("express")
const rraController =require("../controllers/rraController.js");
const electricityController =require("../controllers/electricityController.js");


const router=express.Router();
//RRA Payament
router.post('/rra/validate-vend',rraController.ValidateRRAId);
router.post('/rra/payment',rraController.rraPayment);

//ELECTRICITY Payament
router.post('/electricity/validate-vend',electricityController.ValidateCustomerMeterNumber);
router.post('/electricity/payment',electricityController.electrictyPayment);


module.exports= router