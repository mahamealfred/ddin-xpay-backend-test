const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("../Utils/generateToken.js");

dotenv.config();

const checkEfashePayment = async (req, res) => {
  const trxId = req.query.trxId
 
  const accessToken = await generateAccessToken();
  let URL = `https://sb-api.efashe.com/rw/v2/trx/${trxId}/status`
  try {
    const response = await axios.get(URL.replace(/\/$/, ''),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      communicationStatus: "SUCCESS",
      responseDescription: "Details",
      data: response.data.data
    })
  } catch (error) {
    
    if(error.response.status === 404){
      return res.status(404).json({
        responseCode: 404,
        communicationStatus: "FAILED",
        error: error.response.data.msg
      });
    }
    return res.status(500).json({
      responseCode: 500,
      communicationStatus: "FAILED",
      error: error.message
    });

  }
};

module.exports = checkEfashePayment