const express =require("express")
const rraController =require("../controllers/rraController.js");
const electricityController =require("../controllers/electricityController.js");

const bulkSmsController=require("../controllers/bulkSmsController.js");
const CheckAccountStatus = require("../middlewares/checkAccountStatus.js");
const airtimeController =require("../controllers/airtimeController.js");
const checkEfashePayment = require("../services/checkEfashePayment.js");
const Startimeontroller = require("../controllers/startimeController.js");

const router=express.Router();
//RRA Payament
router.post('/rra/validate-vend',rraController.ValidateRRAId);
router.post('/rra/payment',CheckAccountStatus,rraController.rraPayment);

//ELECTRICITY Payament
router.post('/electricity/validate-vend',electricityController.ValidateCustomerMeterNumber);
router.post('/electricity/payment',CheckAccountStatus,electricityController.ddinElectricityPayment);

//AIRTIME PAYMENT
router.post('/airtime/validate-vend',airtimeController.ValidatePhoneNumber);
router.post('/airtime/payment',CheckAccountStatus,airtimeController.ddinAirtimePayment);

//BULK SMS 
router.post('/pindo-bulksms/payment',CheckAccountStatus,bulkSmsController.ddinPindoBulkSmsPayment);

//STARTIME 
router.post('/startime/validate-vend',Startimeontroller.ValidateStartimeNumber);
router.post('/startime/payment',CheckAccountStatus,airtimeController.ddinAirtimePayment);

//payament status
router.get("/check-efashe-transaction/status",checkEfashePayment)

module.exports= router