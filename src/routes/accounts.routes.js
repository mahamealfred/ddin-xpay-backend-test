const express =require("express")
const  accountsController =require("../controllers/accountsController.js");
const CheckAccountBalanceById = require("../middlewares/CheckAccountBalanceById.js");


const router=express.Router();

router.get('/balance',accountsController.getAccountsBalance);

router.get('/balance/account',accountsController.getAccountsBalanceByID);
//self serve commission
router.post('/commissions/self-serve',CheckAccountBalanceById,accountsController.selfServeCommisiion);

module.exports=router