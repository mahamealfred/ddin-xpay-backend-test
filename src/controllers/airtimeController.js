const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");
const airtimePaymentService = require("../services/airtimeService.js");
const ddinAirtimePaymentService = require("../services/airtimeService.js");
const checkTansactionStatus = require("../Utils/checkEfasheTransactionStatus.js");
const { logsData } = require("../Utils/logsData.js");

dotenv.config();

class AirtimeController {

  //new method
  static async airTimePayment(req, res) {
    const { amount, trxId, transferTypeIdransferTypeId, toMemberId, description, currencySymbol, phoneNumber } = req.body;
    const authheader = req.headers.authorization;
    //agent name
    const authHeaderValue = authheader.split(' ')[1];
    const decodedValue = Buffer.from(authHeaderValue, 'base64').toString('ascii');
    const agent_name = decodedValue.split(':')[0]
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
      //   //save in logs table
        const transactionId = ""
       const thirdpart_status = resp.status
        const service_name = "Airtime Payment"
        const status = "Incomplete"
        logsData(transactionId, thirdpart_status, description, amount, agent_name, status, service_name, trxId)
        ddinAirtimePaymentService(req, res, resp, amount, trxId, transferTypeIdransferTypeId, toMemberId, description, currencySymbol, phoneNumber, authheader)
      
      }

    } catch (error) {
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
        error: error.response.data.msg
      });
    }
  }

 
  static async ValidatePhoneNumber(req, res) {
    const accessToken = await generateAccessToken();
    const { customerAccountNumber } = req.body

    if (!accessToken) {
      return res.status(401).json({
        responseCode: 401,
        communicationStatus: "FAILED",
        responseDescription: "A Token is required for authentication"
      });
    }
    // console.log("accesst:",accessToken.replace(/['"]+/g, ''))
    let data = JSON.stringify({
      verticalId: "airtime",
      customerAccountNumber: customerAccountNumber
    }
    );
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.EFASHE_URL + '/rw/v2/vend/validate',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
      },
      data: data
    };

    try {
      const response = await axios.request(config)

      if (response.status === 200) {
        return res.status(200).json({
          responseCode: 200,
          communicationStatus: "SUCCESS",
          responseDescription: "Customer Detail",
          //data:response.data
          data: {
            pdtId: response.data.data.pdtId,
            pdtName: response.data.data.pdtName,
            pdtStatusId: response.data.data.pdtStatusId,
            verticalId: response.data.data.verticalId,
            customerAccountNumber: response.data.data.customerAccountNumber,
            svcProviderName: response.data.data.svcProviderName,
            vendUnitId: response.data.data.vendUnitId,
            vendMin: response.data.data.vendMin,
            vendMax: response.data.data.vendMax,
            trxResult: response.data.data.trxResult,
            trxId: response.data.data.trxId,
            availTrxBalance: response.data.data.availTrxBalance
          }
        });
      }
      return res.status(500).json({
        responseCode: 500,
        communicationStatus: "FAILED",
        responseDescription: "Something went wrong, Please try again later.",
      });

    } catch (error) {
      if (error.response.status === 404) {
        return res.status(404).json({
          responseCode: 404,
          communicationStatus: "FAILED",
          responseDescription: " Not Found"
        });
      }
      if (error.response.status === 422) {
        return res.status(422).json({
          responseCode: 422,
          communicationStatus: "FAILED",
          responseDescription: error.response.data.msg
        });
      }
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
        error: error.message,
      });
    }

  }

}
module.exports = AirtimeController;