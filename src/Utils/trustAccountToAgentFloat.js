const dotenv = require("dotenv")
const axios = require("axios");
const xml2js = require('xml2js');


const trustAccountToAgentFloat = async (req,res,agent_name,amount) => {
    const url = process.env.CORE_URL+'/services/payment';
    const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pay="http://payments.webservices.cyclos.strohalm.nl/">
    <soapenv:Header/>
    <soapenv:Body>
       <pay:doPayment>
          <!--Optional:-->
          <params>
             <fromSystem>true</fromSystem>  
             <toMemberPrincipalType>USER</toMemberPrincipalType>
             <toMember>${agent_name}</toMember>
             <amount>${amount}</amount>
             <description>Agent Commission Payment</description>
             <transferTypeId>101</transferTypeId>        
          </params>
       </pay:doPayment>
    </soapenv:Body>
 </soapenv:Envelope>
    `;
    
    const headers = {
      'Content-Type': 'text/xml',
      'SOAPAction': ''
    };
    try {
        const response = await axios.post(url, soapRequest, { headers });
        try {
          const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });
         // console.log('JSON response:', JSON.stringify(result, null, 2));
         
         if(result){
            return res.status(200).json({
                responseCode: 200,
                communicationStatus:"SUCCESS",
                responseDescription: "Your request has been successfully processed and is now pending administrative approval. Keep checking your balance for updates. Thank you for being so patient!",
                data:result
              });  
         }
          
        
        } catch (parseError) {
            return res.status(500).json({
                responseCode: 500,
                communicationStatus:"FAILED",
                error: "Failed to transfer the amount to Agent Float Account",
              });  
        }
      } catch (error) {
        console.error('Error making request 108:', error);
        return res.status(500).json({
            responseCode: 500,
            communicationStatus:"FAILED",
            error: "Failed to transfer the amount to Agent Float Account",
          });  
      }
};


module.exports = trustAccountToAgentFloat 