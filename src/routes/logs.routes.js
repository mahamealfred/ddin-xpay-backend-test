const express =require("express")
const logsController =require("../controllers/logsController.js");


const router=express.Router();

router.get('/logs',logsController.getLogs);
router.get('/logs-transactions',logsController.getLogsFromMysql);

module.exports= router