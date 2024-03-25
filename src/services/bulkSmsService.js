const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");
const dbConnect = require("../db/config.js");
const { logsData } = require("../Utils/logsData.js");



dotenv.config();


//best for bulk pindo bulk sms
const bulkSmsPaymentService = async (req, res, response, amount, recipients, description, senderId, smsMessage,service_name,agent_name) => {

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
      //call database Table
      let transactionId=response.data.id
      let thirdpart_status=resp.status
      
      let trxId=""
      let status="Complete"
     logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
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
    let transactionId=response.data.id
    let thirdpart_status=error.response.status
    
    let trxId=""
    let status="Incomplete"
   logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
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
        responseDescription: "Unknown sender Id"

      });
    }
    return res.status(500).json({
      responseCode: 500,
      communicationStatus: "FAILED",
      error: error.message
    });
  }
};




module.exports = bulkSmsPaymentService