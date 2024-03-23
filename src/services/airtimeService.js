const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");
const { updateLogs, logsData } = require("../Utils/logsData.js");

dotenv.config();


const airtimePaymentService = async (req, res, response, amount, description, trxId, phoneNumber, service_name, agent_name) => {
  const accessToken = await generateAccessToken();
  if (!accessToken) {
    return res.status(401).json({
      responseCode: 401,
      communicationStatus: "FAILED",
      responseDescription: "A Token is required for authentication"
    });
  }
  let data = JSON.stringify({
    trxId: trxId,
    customerAccountNumber: phoneNumber,
    amount: amount,
    verticalId: "airtime",
    deliveryMethodId: "direct_topup",
    deliverTo: "string",
    callBack: "string"
  }
  );
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.EFASHE_URL + '/rw/v2/vend/execute',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
    },
    data: data
  };

  try {
    const resp = await axios.request(config)

    if (resp.status === 202) {
      let transactionId=response.data.id
      let thirdpart_status=resp.status
      let status="Complete"
     logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
      return res.status(200).json({
        responseCode: 200,
        communicationStatus: "SUCCESS",
        responseDescription: "Payment has been processed! Details of transactions are included below",
        data: {
          transactionId: response.data.id,
          amount: amount,
          description: description
        }
      });
    }


  } catch (error) {
    let transactionId=response.data.id
    let thirdpart_status=error.response.status
    let status="Incomplete"
   logsData(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)
    if (error.response.status === 400) {
      return res.status(400).json({
        responseCode: 400,
        communicationStatus: "FAILED",
        responseDescription: error.response.data.msg

      });
    }

    return res.status(500).json({
      responseCode: 500,
      communicationStatus: "FAILED",
      error: error.response.data.msg,
    });
  }
}







const ddinAirtimePaymentService = async (req, res, resp, amount, trxId, transferTypeId, toMemberId, description, currencySymbol, phoneNumber, authheader) => {

  let data = JSON.stringify({
    "toMemberId": toMemberId,
    "amount": amount,
    "transferTypeId": transferTypeId,
    "currencySymbol": currencySymbol,
    "description": description
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.CORE_URL + '/rest/payments/confirmMemberPayment',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${authheader}`
    },
    data: data
  };

  try {
    const response = await axios.request(config)
    if (response.status === 200) {

      //call logs table
      const transactionId = response.data.id
      const status = "Complete";
      await updateLogs(transactionId, status, trxId)
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
    //console.log("error :",error.response)
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




module.exports = airtimePaymentService