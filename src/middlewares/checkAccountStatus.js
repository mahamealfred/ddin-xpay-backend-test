const axios = require("axios");
const CheckAccountStatus = async (req, res, next) => {
	const { accountId,amount } = req.body;
    const authheader = req.headers.authorization;
// 	if (found) {
// 		 req.user = found
// 		 return next()
// 	}
//    req.user = null
// 	next();

    try {
        const response = await axios.get(process.env.CORE_TEST_URL+'/coretest/rest/accounts/default/status',{
           headers: {
               Authorization: authheader,
             },
             withCredentials: true,
               });
               if(response.status===200 && response.data.balance > amount){
                return next()
                //    return res.status(200).json({
                //        responseCode: 200,
                //        communicationStatus:"SUCCESS",
                //        responseDescription: "Agent Accounts",
                //        data:{
                //            balance:response.data.balance,
                //            formattedBalance:response.data.formattedBalance,
                //            availableBalance:response.data.availableBalance,
                //            formattedAvailableBalance:response.data.formattedAvailableBalance,
                //            reservedAmount:response.data.reservedAmount,
                //            formattedReservedAmount:response.data.formattedReservedAmount,
                //            creditLimit:response.data.creditLimit,
                //            formattedCreditLimit:response.data.formattedCreditLimit
                //        }
                //      });  
               }
                   return res.status(400).json({
                       responseCode: 400,
                       communicationStatus:"FAILED",
                       responseDescription: "Insufficient amount to perform this transaction",
                     });
               
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

module.exports=CheckAccountStatus
