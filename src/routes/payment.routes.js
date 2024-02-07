import  { Router } from "express";
import rraController from "../controllers/rraController.js";
import electricityController from "../controllers/electricityController.js";


const router=Router();
//RRA Payament
router.post('/rra/payment',rraController.rraPayment);

//ELECTRICITY Payament
router.post('/electricity/validate-vend',electricityController.ValidateCustomerMeterNumber);
router.post('/electricity/payment',electricityController.electrictyPayment);
export default router