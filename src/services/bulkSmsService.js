const dotenv =require("dotenv")
const axios =require("axios");
const generateAccessToken =require("../Utils/generateToken.js");

dotenv.config();

const bulkSmsPaymentService = async(req,res,response,amount,recipients,description,senderId,smsMessage)=>{

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
          'Authorization': 'Bearer '
        },
        data : data
      };
      
      try{
          const resp =await axios.request(config)
          if(resp.status===201){
              return res.status(200).json({
                  responseCode: 200,
                  communicationStatus:resp.data.status,
                  codeDescription:"SMS has been sent.",
                  responseDescription: "SMS has been sent!",
                  data:{
                    transactionId:response.data.id,
                    amount:amount,
                    description:description,
                    pindoSmsId:1
                  }
                });  
          }
           
      } catch (error) {
      
        if(error.response.status===400){
          return res.status(400).json({
              responseCode: 400,
              communicationStatus:"FAILED",
              responseDescription:error.response.data.message
            });  
      }
      if(error.response.status===401){
        return res.status(401).json({
            responseCode: 401,
            communicationStatus:"FAILED",
            responseDescription:error.response.data.message
           
          });  
    }
    if(error.response.status===409){
      return res.status(409).json({
          responseCode: 409,
          communicationStatus:"FAILED",
          responseDescription:"Unknown sender id"
         
        });  
  }
          return res.status(500).json({
              responseCode: 500,
              communicationStatus:"FAILED",
              error: error.message
            });  
      }
};

module.exports= bulkSmsPaymentService