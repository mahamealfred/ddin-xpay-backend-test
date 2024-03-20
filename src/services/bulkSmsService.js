const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");
const dbConnect = require("../db/config.js");
const { logsData } = require("../Utils/logsData.js");


dotenv.config();


//best for bulk pindo bulk sms
const ddinPindoBulkSmsPayment = async (req, res, resp, amount, transferTypeId, toMemberId, description, currencySymbol, authheader) => {
  const authHeaderValue = authheader.split(' ')[1]; // Extracting the value after 'Basic ' or 'Bearer '
     const decodedValue = Buffer.from(authHeaderValue, 'base64').toString('ascii');
     const agent_name=decodedValue.split(':')[0]
     const service_name="Pindo Bulks SMS"
     const trxId=""
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
    url: process.env.CORE_TEST_URL + '/coretest/rest/payments/confirmMemberPayment',
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
     const transactionId=response.data.id
     const thirdpart_status=resp.data.status
     
     const trxId=""
     const status="Complete"
    logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
      return res.status(200).json({
        responseCode: 200,
        communicationStatus: resp.data.status,
        codeDescription: description,
        responseDescription: description,
        data: {
          transactionId: response.data.id,
          amount: amount,
          description: description,
          pindoSmsId: 1
        }
      });
    }else{
      const transactionId=""
      const thirdpart_status=resp.data.status
      const status="Incomplete"
     return logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
    }

  } catch (error) {
    const transactionId=""
    const thirdpart_status=resp.data.status
    const status="Incomplete"
    logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)

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

}

const bulkSmsPaymentService = async (req, res, response, amount, recipients, description, senderId, smsMessage) => {

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
    data: data
  };

  try {
    const resp = await axios.request(config)
    if (resp.status === 201) {
      // console.log("response from cyclos:",response)
      return res.status(200).json({
        responseCode: 200,
        communicationStatus: resp.data.status,
        codeDescription: description,
        responseDescription: description,
        data: {
          transactionId: response.data.id,
          amount: amount,
          description: description,
          pindoSmsId: 1
        }
      });
    }

  } catch (error) {

    if (error.response.status === 400) {
      return res.status(400).json({
        responseCode: 400,
        communicationStatus: "FAILED",
        responseDescription: error.response.data.message
      });
    }
    if (error.response.status === 401) {
      return res.status(401).json({
        responseCode: 401,
        communicationStatus: "FAILED",
        responseDescription: error.response.data.message

      });
    }
    if (error.response.status === 409) {
      return res.status(409).json({
        responseCode: 409,
        communicationStatus: "FAILED",
        responseDescription: "Unknown sender id"

      });
    }
    return res.status(500).json({
      responseCode: 500,
      communicationStatus: "FAILED",
      error: error.message
    });
  }
};

module.exports = ddinPindoBulkSmsPayment 