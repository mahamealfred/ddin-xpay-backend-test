const express =require("express")
const  accountsController =require("../controllers/accountsController.js");


const router=express.Router();

router.get('/balance',accountsController.getAccountsBalance);

module.exports=router