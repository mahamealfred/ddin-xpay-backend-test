import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
class rraController{
    static async rraPayment(req, res) {
        const {amount}=req.body
        const authheader = req.headers.authorization;
        let data = JSON.stringify({
            "toMemberId": "34",
            "amount": `${amount}`,
            "transferTypeId": "85",
            "currencySymbol": "Rwf",
            "description": "RRA Tax Payment"
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.CORE_TEST_URL+'/coretest/rest/payments/confirmMemberPayment',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `${authheader}`
            },
            data : data
          };

        try{
            const response =await axios.request(config)
            if(response.status===200){
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus:"SUCCESS",
                    responseDescription: "Payment has been processed! Details of transactions are included below",
                    data:response.data
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
export default rraController;