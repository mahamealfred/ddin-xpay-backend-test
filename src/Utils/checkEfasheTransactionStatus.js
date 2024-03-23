const dbConnect = require("../db/config");
const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("./generateToken");

const checkTansactionStatus= async(req,res,trxId)=>{
  const accessToken = await generateAccessToken();
      // let config = {
      //   method: 'get',
      //   maxBodyLength: Infinity,
      //   url: `https://sb-api.efashe.com/rw/v2/vend/${trxId}/status`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
      //   }
      // };
    
      // const responseData=await  axios.request(config)
      // .then((response) => {
        
      //   const token=JSON.stringify(response.data.data)
      //   console.log("status respo:",JSON.stringify(response.data.data));
      //   return token
       
      // })
      // .catch((error) => {
      //   return JSON.stringify({
      //       responseCode:error.response.status,
      //       communicationStatus:"FAILED",
      //       error: error.message,
      //     });  
      // });
      // return responseData;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://sb-api.efashe.com/rw/v2/vend/${trxId}/status`,
        headers: { 
          'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
        }
      };
      
      const responseData=await  axios.request(config)
      .then((response) => {
       
        const token=JSON.stringify(response.data.data)
        return token
      })
      .catch((error) => {
        console.log(error);
          return JSON.stringify({
            responseCode:error.response.status,
            communicationStatus:"FAILED",
            error: error.message,
          });  
      });
      return responseData;
      
      
      
    };

module.exports= checkTansactionStatus