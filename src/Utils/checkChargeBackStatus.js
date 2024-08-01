const dotenv = require("dotenv")
const axios = require("axios");



const ChargebackStatus = async (transferId) => {
    let URL = process.env.CORE_URL+'/services/payment'
    let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pay="http://payments.webservices.cyclos.strohalm.nl/">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <pay:chargeback>\r\n         <!--Optional:-->\r\n         <transferId>${transferId}</transferId>\r\n      </pay:chargeback>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: URL,
        headers: {
            'Content-Type': 'application/xml'
        },
        data: data
    };

   await axios.request(config)
        .then((response) => {

            //console.log("Chargeback",JSON.stringify(response.data));
            return JSON.stringify(response.data)
        })
        .catch((error) => {
            console.log(error);
        })
};


module.exports = ChargebackStatus 