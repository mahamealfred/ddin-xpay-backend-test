import  { Router } from "express";
import accountsController from "../controllers/accountsController.js";


const router=Router();

router.get('/balance',accountsController.getAccountsBalance);

export default router