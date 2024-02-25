const dotenv =require("dotenv")
const axios =require("axios");
dotenv.config();
class authController{
    static async signIn(req, res) {
        const authheader = req.headers.authorization;
        try {
     const response = await axios.get(process.env.CORE_TEST_URL+'/coretest/rest/members/me',{
        headers: {
            Authorization: authheader,
          },
          withCredentials: true,
            });
            if(response.status===200){
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus:"SUCCESS",
                    responseDescription: "Successfully logged",
                    data:{
                        id:response.data.id,
                        name:response.data.name,
                        email:response.data.email,
                        phoneNumber:response.data.customValues[0].value,
                        agentCategory:response.data.customValues[10].value
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
            return res.status(500).json({
                responseCodeCode: 500,
                communicationStatus:"FAILED",
                error: error.message,
              });  
        }
   
    }
   
}
module.exports=authController;