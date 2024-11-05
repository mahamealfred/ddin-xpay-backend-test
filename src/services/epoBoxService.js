const dotenv = require("dotenv")
const axios = require("axios");
const createNewEpoBoxAccount = require("./epoBoxRegisterService");


dotenv.config();
//new methode
const makeEpoBoxPayment = async (
    req,res,toMemberId, transferTypeId, currencySymbol, description
) => {
  const authheader = req.headers.authorization;

      let data = JSON.stringify({
        "toMemberId": `${toMemberId}`,
        "amount": "8000",
        "transferTypeId": `${transferTypeId}`,
        "currencySymbol": currencySymbol,
        "description": description,
       
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
          let transactionId=response.data.id
          
        //   return res.status(200).json({
        //     responseCode: 200,
        //     communicationStatus: "SUCCESS",
        //     responseDescription: description,
        //     data: {
        //       transactionId: response.data.id,
        //       description: description,
        //     }
        //   });
        //Call EPOBOX ENDPOINT FOR REGISTRATION
        createNewEpoBoxAccount(req,res,description,transactionId)
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
          error: "Dear client, Your transaction has been processed; please get in touch with DDIN Support for follow-up"
        });
      }
    } 
  
module.exports = makeEpoBoxPayment