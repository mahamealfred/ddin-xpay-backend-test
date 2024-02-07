import  { Router } from "express";
import logsController from "../controllers/logsController.js";


const router=Router();

router.get('/logs',logsController.getLogs);

export default router