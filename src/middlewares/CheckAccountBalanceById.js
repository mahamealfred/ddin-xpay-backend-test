const axios = require("axios");
const CheckAccountBalanceById = async (req, res, next) => {
	const { accountId,amount } = req.body;
    const authheader = req.headers.authorization;

    try {
        const response = await axios.get(process.env.CORE_URL+`/rest/accounts/${accountId}/status`,{
           headers: {
               Authorization: authheader,
             },
             withCredentials: true,
               });
               if(response.status===200 && response.data.balance < amount){
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus:"FAILED",
                    responseDescription: "Insufficient funds to perform this transaction",
                  });
               }
               if(response.status===200 && amount < 100){
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus:"FAILED",
                    responseDescription: "The minimum amount to withdraw is 5,000 Rwf",
                  });
               }
               return next()
                
               
           } catch (error) {
               if(error.response.status===401){
                   return res.status(401).json({
                       responseCode: 401,
                       communicationStatus:"FAILED",
                       responseDescription: "Username and Password are required for authentication"
                     }); 
               }
               if(error.response.status===400){
                   return res.status(400).json({
                       responseCode: 400,
                       communicationStatus:"FAILED",
                       responseDescription: "Invalid Username or Password"
                     }); 
               }
               if(error.response.status===404){
                   return res.status(404).json({
                       responseCode: 404,
                       communicationStatus:"FAILED",
                       responseDescription: "Account Not Found"
                     }); 
               }
               return res.status(500).json({
                   responseCode: 500,
                   communicationStatus:"FAILED",
                   error: error.message,
                 });  
           }
      
       }

module.exports=CheckAccountBalanceById
