import  { Router } from "express";
import authRoute from "./auth.routes.js";
import accountsRoute from "./accounts.routes.js";
const router=Router();

//authentication
 router.use('/api/v1/authentication',authRoute);
 //agent accounts
 router.use('/api/v1/accounts',accountsRoute);
//goverment services


export default router;