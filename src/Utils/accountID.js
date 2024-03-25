const dotenv =require("dotenv")
const axios =require("axios");


dotenv.config();

const accountID = async(req,res,authheader)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.CORE_URL+'/rest/accounts/info',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: authheader,
        }
      };
      
    const response=await  axios.request(config)
      .then((response) => {
        const data=response.data
        return data
      })
      .catch((error) => {
        console.log(error);
      });
return response
}

module.exports= accountID