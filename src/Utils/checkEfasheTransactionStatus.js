const dbConnect = require("../db/config");
const dotenv = require("dotenv")
const axios = require("axios");
const generateAccessToken = require("./generateToken");


const callPollEndpoint = async (responseData) => {
  const accessToken = await generateAccessToken();
  let URL=`https://sb-api.efashe.com/rw${responseData.data.data.pollEndpoint}`
 
  try {
    const response = await axios.get(URL.replace(/\/$/, ''),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.replace(/['"]+/g, '')}`
        },
      }
      );
      if(response.status === 200){
        return response
      }
    // console.log('Response from poll endpoint:', response.data);
    // Handle response as needed
  } catch (error) {
    console.error('Error calling poll endpoint:', error);
    // Handle error
  }
  return response
};


module.exports= callPollEndpoint