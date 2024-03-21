const dotenv =require("dotenv")
const axios =require("axios");
const generateAccessToken =require("../Utils/generateToken.js");
const bulkSmsPaymentService = require("../services/bulkSmsService.js");
const ddinPindoBulkSmsPayment = require("../services/bulkSmsService.js");
dotenv.config();

class bulkSmsController{
  //new method
  static async pindoBulkSMSPayment(req, res) {
    const {amount,recipients,transferTypeId,toMemberId,description,senderId,smsMessage,currencySymbol}=req.body;
    const authheader = req.headers.authorization;
    let data = JSON.stringify({
      "sender": senderId,
      "text": smsMessage,
      "recipients": recipients
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.pindo.io/v1/sms/bulk',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer eyJhbGciOiJub25lIn0.eyJpZCI6Ijc1MSIsInJldm9rZWRfdG9rZW5fY291bnQiOjV9.'
      },
      data : data
    };
    
    try{
        const resp =await axios.request(config)
        if(resp.status===201){
             //call logs ddin core
          await ddinPindoBulkSmsPayment(req,res,resp ,amount,transferTypeId,toMemberId,description,currencySymbol,authheader )
       
        }
         
    } catch (error) {
      // if (error.response.status === 409) {
      //   return res.status(409).json({
      //     responseCode: 409,
      //     communicationStatus: "FAILED",
      //     responseDescription: error.response.data.message
      //   });
      // }
      return res.status(500).json({
        responseCode: 500,
        communicationStatus: "FAILED",
        error: error.message
      });
    }
  };

  
   
   
}
module.exports= bulkSmsController;