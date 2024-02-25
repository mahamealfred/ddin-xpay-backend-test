const express =require("express")
const logsController =require("../controllers/logsController.js");


const router=express.Router();

router.get('/logs',logsController.getLogs);

module.exports= router