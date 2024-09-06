const dotenv =require("dotenv")
const axios =require("axios");
const bulkSmsPaymentService = require("../services/bulkSmsService.js");
dotenv.config();

class bulkSmsController{

  static async  ddinPindoBulkSmsPayment(req,res){
    const {amount,recipients,transferTypeId,toMemberId,description,senderId,smsMessage,currencySymbol}=req.body;
    const authheader = req.headers.authorization;
    const authHeaderValue = authheader.split(' ')[1]; // Extracting the value after 'Basic ' or 'Bearer '
       const decodedValue = Buffer.from(authHeaderValue, 'base64').toString('ascii');
       const agent_name=decodedValue.split(':')[0]
       const service_name="Pindo Bulks SMS"
    let data = JSON.stringify({
      "toMemberId": `${toMemberId}`,
      "amount": `${amount}`,
      "transferTypeId": `${transferTypeId}`,
      "currencySymbol": currencySymbol,
      "description": description
  
    });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.CORE_URL+'/rest/payments/confirmMemberPayment',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authheader}`
      },
      data: data
    };
  
    try {
      const response = await axios.request(config)
      if (response.status === 200){
       //call logs table
      // await bulkSmsPaymentService(req, res, response, amount, recipients, description, senderId, smsMessage,service_name,agent_name)
      return res.status(200).json({
        responseCode: 200,
        communicationStatus: "SUCCESS",
        responseDescription: description,
        data:{
          transactionId: response.data.id,
          amount: amount,
          description: description
        }
      });
    }
    } catch (error) {
  
      if (error.response.status === 401) {
        return res.status(401).json({
          responseCode: 401,
          communicationStatus: "FAILED",
          responseDescription: "Username and Password are required for authentication"
        });
      }
      if (error.response.status === 400) {
        return res.status(400).json({
          responseCode: 400,
          communicationStatus: "FAILED",
          responseDescription: "Invalid Username or Password"
        });
      }
      if (error.response.status === 404) {
        return res.status(404).json({
          responseCode: 404,
          communicationStatus: "FAILED",
          responseDescription: "Account Not Found"
        });
      }
      return res.status(500).json({
        responseCode: 500,
        communicationStatus: "FAILED",
        error: "Dear client, we're unable to complete your transaction right now. Please try again later.",
      });
    }
  
  }

}
module.exports= bulkSmsController;