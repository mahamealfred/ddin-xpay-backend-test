const dotenv =require("dotenv")
const axios =require("axios");
const generateAccessToken =require("../Utils/generateToken.js");
const bulkSmsPaymentService = require("../services/bulkSmsService.js");


dotenv.config();


class electricityController{
    static async bulkSMSPayment(req, res) {
        const {amount,recipients,transferTypeId,toMemberId,description,senderId,smsMessage,currencySymbol}=req.body;
        const authheader = req.headers.authorization;
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
            url: 'https://core.ddin.rw/core/rest/payments/confirmMemberPayment',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `${authheader}`
            },
            data : data
          };

        try{
            const response =await axios.request(config)
            if(response.status===200){
                //call electricity service payment
               //await electricityPaymentService(req,res,response,amount,meterNumber,trxId)
               await bulkSmsPaymentService(req,res,response,amount,recipients,description,senderId,smsMessage)
            }
                
        } catch (error) {
            if(error.response.status===401){
                return res.status(401).json({
                    responseCode: 401,
                    communicationStatus:"FAILED",
                    responseDescription: "Username and Password are required for authentication"
                  }); 
            }
            if(error.response.status===400){
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus:"FAILED",
                    responseDescription: "Invalid Username or Password"
                  }); 
            }
            if(error.response.status===404){
                return res.status(404).json({
                    responseCode: 404,
                    communicationStatus:"FAILED",
                    responseDescription: "Account Not Found"
                  }); 
            }
            return res.status(500).json({
                responseCode: 500,
                communicationStatus:"FAILED",
                error: error.message,
              });  
        }
          
    }
    static async ValidateCustomerMeterNumber(req, res) {
      const accessToken = await generateAccessToken();
      const {customerAccountNumber}=req.body

      if(!accessToken){
        return res.status(401).json({
          responseCode: 401,
          communicationStatus:"FAILED",
          responseDescription: "A Token is required for authentication"
        }); 
      }
      // console.log("accesst:",accessToken.replace(/['"]+/g, ''))
      let data = JSON.stringify({
        verticalId: "electricity",
        customerAccountNumber: customerAccountNumber
      }
      );
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: process.env.EFASHE_URL+'/rw/v2/vend/validate',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization':`Bearer ${accessToken.replace(/['"]+/g, '')}`
          },
          data : data
        };

      try{
          const response =await axios.request(config)
         
          if(response.status===200){
              return res.status(200).json({
                  responseCode: 200,
                  communicationStatus:"SUCCESS",
                  responseDescription: "Customer Detail",
                  data:{
                    pdtId: response.data.data.pdtId,
                    pdtName: response.data.data.pdtName,
                    pdtStatusId: response.data.data.pdtStatusId,
                    verticalId: response.data.data.verticalId,
                    customerAccountNumber: response.data.data.customerAccountNumber,
                    svcProviderName:response.data.data. svcProviderName,
                    vendUnitId: response.data.data.vendUnitId,
                    vendMin:response.data.data.vendMin,
                    vendMax: response.data.data.vendMax,
                    trxResult: response.data.data.trxResult,
                    trxId: response.data.data.trxId,
                    availTrxBalance: response.data.data.availTrxBalance
                  }
                });  
          }
              return res.status(500).json({
                  responseCode: 500,
                  communicationStatus:"FAILED",
                  responseDescription: "Something went wrong, Please try again later.",
                });
          
      } catch (error) {
      
          if(error.response.status===404){
              return res.status(404).json({
                  responseCode: 404,
                  communicationStatus:"FAILED",
                  responseDescription: " Not Found"
                }); 
          }
          if(error.response.status===422){
            return res.status(422).json({
                responseCode: 422,
                communicationStatus:"FAILED",
                responseDescription: error.response.data.msg
              }); 
        }
          return res.status(500).json({
              responseCode: 500,
              communicationStatus:"FAILED",
              error: error.message,
            });  
      }
        
  }
   
}
module.exports= electricityController;