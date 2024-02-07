import  { Router } from "express";
import authRoute from "./auth.routes.js";
import accountsRoute from "./accounts.routes.js";
import logsRoute from "./logs.routes.js";
import paymentRoute from "./payment.routes.js";
const router=Router();

//authentication
 router.use('/api/v1/authentication',authRoute);
 //agent accounts
 router.use('/api/v1/accounts',accountsRoute);
//goverment services
router.use('/api/v1/payment-service',paymentRoute);

//logs
router.use('/api/v1/transactions',logsRoute);


export default router;