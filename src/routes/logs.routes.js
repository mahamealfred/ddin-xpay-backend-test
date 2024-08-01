const express =require("express")
const logsController =require("../controllers/logsController.js");


const router=express.Router();

router.get('/logs',logsController.getLogs);
router.get('/logs-transactions',logsController.getLogsFromMysql);
router.get('/tansaction-byId/:id',logsController.TransactionsByID)

router.get('/all-logs-transactions',logsController.getTransactionsLogs);
//bulk service payment
router.get('/bulkService-logs-transactions',logsController.getBulkServicePaymentFromMysql);
router.get('/bulkService-logs-byAgentName-transactions/',logsController.getBulkServicePaymentByAgentName);
module.exports= router