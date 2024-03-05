const dotenv =require("dotenv")
const axios =require("axios");
const generateAccessToken =require("../Utils/generateToken.js");

dotenv.config();

const checkEfashePayment= async(req,res,response,amount,meterNumber,trxId)=>{
    const accessToken = await generateAccessToken();
      if(!accessToken){
        return res.status(401).json({
          responseCode: 401,
          communicationStatus:"FAILED",
          responseDescription: "A Token is required for authentication"
        }); 
      }
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://sb-api.efashe.com/rw/v2/vend/${trxId}/status`,
        headers: { 
          'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
        }
      };
        // let config = {
        //   method: 'get',
        //   maxBodyLength: Infinity,
        //   url:process.env.EFASHE_URL+'/rw/v2/vend/execute',
        //   headers: { 
        //     'Content-Type': 'application/json', 
        //     'Authorization':`Bearer ${accessToken.replace(/['"]+/g, '')}`
        //   },
        //   data : data
        // };
      try{
          const resp =await axios.request(config)
          if(resp.status===200){
              return res.status(200).json({
                  responseCode: 200,
                  communicationStatus:"SUCCESS",
                  responseDescription: "Payment has been processed! Details of transactions are included below",
                  data:response.data
                });  
          }
      } catch (error) {
      
        if(error.response.status===400){
          return res.status(400).json({
              responseCode: 400,
              communicationStatus:"FAILED",
              responseDescription:error.response.data.msg
             
            });  
      }
      
          return res.status(500).json({
              responseCode: 500,
              communicationStatus:"FAILED",
              error: error.response.data.msg,
            });  
      }
};

module.exports= checkEfashePayment