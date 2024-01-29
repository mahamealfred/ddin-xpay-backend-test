import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
class accountsController{
    static async getAccountsBalance(req, res) {
        const authheader = req.headers.authorization;
        try {
     const response = await axios.get(process.env.CORE_TEST_URL+'/coretest/rest/accounts/7/status',{
        headers: {
            Authorization: authheader,
          },
          withCredentials: true,
            });
            if(response.status===200){
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus:"SUCCESS",
                    responseDescription: "Agent Accounts",
                    data:{
                        balance:response.data.balance,
                        formattedBalance:response.data.formattedBalance,
                        availableBalance:response.data.availableBalance,
                        formattedAvailableBalance:response.data.formattedAvailableBalance,
                        reservedAmount:response.data.reservedAmount,
                        formattedReservedAmount:response.data.formattedReservedAmount,
                        creditLimit:response.data.creditLimit,
                        formattedCreditLimit:response.data.formattedCreditLimit
                    }
                  });  
            }
                return res.status(500).json({
                    responseCode: 500,
                    communicationStatus:"FAILED",
                    responseDescription: "Something went wrong, Please try again later.",
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
                responseCodeCode: 500,
                communicationStatus:"FAILED",
                error: error.message,
              });  
        }
   
    }
   
}
export default accountsController;