const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");
const { updateLogs } = require("../Utils/logsData.js");

dotenv.config();

const ddinRraPaymentService = async (req, res,amount,referenceId,taxpayer, trxId, transferTypeId, toMemberId, description, currencySymbol, phoneNumber, authheader) => {
  
  let data = JSON.stringify({
    "toMemberId": toMemberId,
    "amount": amount,
    "transferTypeId": transferTypeId,
    "currencySymbol": currencySymbol,
    "description": description,
    "customValues": [
        {
        "internalName" : "tax_identification_number",
        "fieldId" : "82",
        "value" : "11986801789765"
        },
            {
        "internalName" : "validation_id",
        "fieldId" : "83",
        "value" : "12345"
            },
            {
        "internalName" : "tax_document_id",
        "fieldId" : "84",
        "value" :`${referenceId}`
            },
            {
        "internalName" : "tax_center",
        "fieldId" : "85",
        "value" : "Kigali"
            },
            {
        "internalName" : "declaration_date",
        "fieldId" : "86",
        "value" : "2024-02-09"
            },
            {
        "internalName" : "full_payment_status",
        "fieldId" : "87",
        "value" : "Successful"
            },
            {
        "internalName" : "tax_type",
        "fieldId" : "88",
        "value" : "Cleaning Fee"
            },
            {
        "internalName" : "taxpayer",
        "fieldId" : "89",
        "value" : `${taxpayer}`
            },
            {
        "internalName" : "createdat",
        "fieldId" : "90",
        "value" : "2024-02-09"
            },
            {
        "internalName" : "updatedat",
        "fieldId" : "91",
        "value" : "2024-02-09"
            },
            {
        "internalName" : "receiptNo",
        "fieldId" : "92",
        "value" : "DDIN123456789"
            }
        ]
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.CORE_TEST_URL+'/coretest/rest/payments/confirmMemberPayment',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization':  `${authheader}`
    },
    data : data
  };
 
  try {
    const response = await axios.request(config)
    if (response.status === 200) {
      
//call logs table
const transactionId=response.data.id
const status="Complete";
updateLogs(transactionId,status, trxId)
      return res.status(200).json({
        responseCode: 200,
        communicationStatus: "SUCCESS",
        codeDescription: description,
        responseDescription: description,
        data: {
          transactionId: response.data.id,
          amount: amount,
          description: description
        }
      });
    }

  } catch (error) {
    console.log("error :",error.response)
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
      error: error.message,
    });
  }
};



module.exports = ddinRraPaymentService