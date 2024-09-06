const dotenv =require("dotenv")
const axios =require("axios");
const generateAccessToken =require("../Utils/generateToken.js");
const { logsData } = require("../Utils/logsData.js");
const ddinRraPaymentService = require("../services/rraService.js");
const findNetAmount = require("../Utils/findNetAmount.js");
dotenv.config();
class rraController{

  static async rraPayment(req, res) {
    const { amount, trxId,transferTypeId, toMemberId, description, currencySymbol, phoneNumber,taxPayer,tin,agentCategory} = req.body;
    const authheader = req.headers.authorization;
    const authHeaderValue = authheader.split(' ')[1];
       const decodedValue = Buffer.from(authHeaderValue, 'base64').toString('ascii');
       const agent_name=decodedValue.split(':')[0]
       const service_name="RRA"
       let netAmount=findNetAmount(amount)
       
    let data = JSON.stringify({
      "toMemberId": `${toMemberId}`,
      "amount": `${amount}`,
      "transferTypeId": `${transferTypeId}`,
      "currencySymbol": currencySymbol,
      "description": description,
      "customValues": [
       {
      "internalName" : agentCategory==="Corporate"?"tax_identification_number_v1":"tax_identification_number",
      "fieldId" : agentCategory==="Corporate"?"83":"82",
      "value" : tin
       },
        {
      "internalName" : agentCategory==="Corporate"?"tax_document_id_v1":"tax_document_id",
      "fieldId" : agentCategory==="Corporate"?"84":"84",
      "value" : phoneNumber
        },
        {
      "internalName" : agentCategory==="Corporate"?"taxpayer_v1":"taxpayer",
      "fieldId" : agentCategory==="Corporate"?"89":"89",
      "value" : taxPayer
        },
	    {
      "internalName" : "trans_id",
      "fieldId" : "118",
      "value" : trxId
        },
      {
          "internalName" : "net_amount",
          "fieldId" : "119",
          "value" : netAmount
         }
    ]
  
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
       //await ddinRraPaymentService(req, res, response, amount, description, trxId,phoneNumber,service_name,agent_name)
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

    //validate RRA id
    static async ValidateRRAId(req, res) {
      const accessToken = await generateAccessToken();
      const {customerAccountNumber}=req.body
      if(!accessToken){
        return res.status(401).json({
          responseCode: 401,
          communicationStatus:"FAILED",
          responseDescription: "A Token is required for authentication"
        }); 
      }
      if(customerAccountNumber==="1234459882"){
        return res.status(200).json({
          responseCode: 200,
          communicationStatus:"SUCCESS",
          responseDescription: " Details",
          data:{
            "pdtId": "rra-tax",
            "pdtName": "RRA",
            "pdtStatusId": "active",
            "verticalId": "tax",
            "customerAccountName": "Kanamugire Leon Eustache",
            "svcProviderName": "RRA",
            "vendUnitId": "flexible",
            "vendMin": 1,
            "vendMax": 200.0,
            "selectAmount": null,
            "localStockMgt": null,
            "stockedPdts": null,
            "stock": null,
            "trxResult": "direct_topup",
            "trxId": "bfd96634-2f90-49b2-a4c9-0f94241d6f9e",
            "availTrxBalance": 140869.35999999987,
            "deliveryMethods": [
                {
                    "id": "sms",
                    "name": "Direct Topup"
                }
            ],
            "extraInfo": {
                tin:"1235535610",
                validate_id:"1234459882",
                pay_ref:"",
                tax_center:"",
                dec_date:"06-09-2024",
                is_full_pay:false,
                tax_type:"Property Tax"
    
            }
        }
        });  
      }
      return res.status(400).json({
        responseCode: 400,
        communicationStatus:"FAILED",
        responseDescription: "Invalit reference number"
      }); 
      // console.log("accesst:",accessToken.replace(/['"]+/g, ''))
      // let data = JSON.stringify({
      //   verticalId: "tax",
      //   customerAccountNumber: customerAccountNumber
      // }
      // );
      //   let config = {
      //     method: 'post',
      //     maxBodyLength: Infinity,
      //     url: process.env.EFASHE_URL+'/rw/v2/vend/validate',
      //     headers: { 
      //       'Content-Type': 'application/json', 
      //       'Authorization':`Bearer ${accessToken.replace(/['"]+/g, '')}`
      //     },
      //     data : data
      //   };

      // try{
      //     const response =await axios.request(config)
         
      //     if(response.status===200){
      //         return res.status(200).json({
      //             responseCode: 200,
      //             communicationStatus:"SUCCESS",
      //             responseDescription: " Details",
      //             data:response.data.data
      //           });  
      //     }
            
          
      // } catch (error) {
      
      //     if(error.response.status===404){
      //         return res.status(404).json({
      //             responseCode: 404,
      //             communicationStatus:"FAILED",
      //             responseDescription: " Not Found"
      //           }); 
      //     }
      //     if(error.response.status===400){
      //       return res.status(400).json({
      //           responseCode: 400,
      //           communicationStatus:"FAILED",
      //           responseDescription: error.response.data.msg
      //         }); 
      //   }
      //     return res.status(500).json({
      //         responseCode: 500,
      //         communicationStatus:"FAILED",
      //         error: "Dear client, we're unable to complete your transaction right now. Please try again later."
      //       });  
      // } 
        
  }
   
}
module.exports= rraController;