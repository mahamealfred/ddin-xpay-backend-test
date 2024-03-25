const dotenv =require("dotenv")
const axios =require("axios");
const accountID = require("../Utils/accountID");
dotenv.config();
class authController{
    static async signIn(req, res) {
        const authheader = req.headers.authorization;
        try {
     const response = await axios.get(process.env.CORE_URL+'/rest/members/me',{
        headers: {
            Authorization: authheader
          },
          withCredentials: true,
            });
            if(response.status===200){
                const data=await accountID(req,res,authheader)
                     let agentFloatAccountId=""
                    let  agentInstantCommissionAccountId=""
                    let   agentDelayedCommissionAccountId=""
                data.forEach(account => {
                
                    if(account.account.type.name ==="Agent Delayed Commission A/C"){
                        agentDelayedCommissionAccountId=(account.account.id).toString()
                    }
                    else if(account.account.type.name === "Agent Float A/C"){
                        agentFloatAccountId=(account.account.id).toString()
                    }else{
                        agentInstantCommissionAccountId=(account.account.id).toString()
                    }
                });
                // console.log("true response:",data)
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus:"EXIST",
                    codeDescription: "SUCCESS",
                    responseDescription: "Successfully logged",
                    data:{
                        id:response.data.id,
                        name:response.data.name,
                        email:response.data.email,
                        phone: response.data.customValues[0].value,
                        username: response.data.username,
                        image: null,
                        country: response.data.customValues[3].value,
                        nationalId: response.data.customValues[1].value,
                        birthday: response.data.customValues[8].value,
                        gender: response.data.customValues[7].value,
                        city: null,
                        province: response.data.customValues[4].value,
                        district: response.data.customValues[5].value,
                        sector: response.data.customValues[6].value,
                        agentCategory: response.data.customValues[10].value,
                       // account:data,
                        agentFloatAccountId: agentFloatAccountId,
                        agentInstantCommissionAccountId: agentInstantCommissionAccountId,
                        agentDelayedCommissionAccountId: agentDelayedCommissionAccountId
                        
                    }
                  });  
            }
                
            
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
                responseCode: 500,
                communicationStatus:"FAILED",
                error: error.message,
              });  
        }
   
    }
   
}
module.exports=authController;