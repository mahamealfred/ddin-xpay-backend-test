const dbConnect = require("../db/config");
const dotenv = require("dotenv")
const axios = require("axios");

const checkTansactionStatus= async(req,res,trxId,authheader)=>{
    
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://sb-api.efashe.com/rw/v2/vend/8a5b228e-87a3-4710-8892-9737792b94dc/status`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authheader}`
        }
      };
    
      try {
        const response = await axios.request(config)
        if (response.status === 200) {
          return res.status(200).json({
            responseCode: 200,
            communicationStatus: "SUCCESS",
            codeDescription: "dETAILS",
            responseDescription: "DETAILS",
            data: response.data
          });
        }
    
      } catch (error) {
    
        return res.status(500).json({
          responseCode: 500,
          communicationStatus: "FAILED",
          error: error.message,
        });
      }
    };

module.exports= checkTansactionStatus