const dotenv = require("dotenv")
const axios = require("axios");
const makeEpoBoxPayment = require("../services/epoBoxService");

dotenv.config();


function generateUsername(firstName, lastName) {
    // Convert names to lowercase and concatenate
    let username = `${firstName.toLowerCase()}`;

    // If the username is 12 characters or longer, truncate it
    if (username.length >= 12) {
        username = username.substring(0, 10); // Keep it under 12 characters
    }

    return username;
}

function generateStrongPassword(length = 12) {
    // Define the characters to include in the password
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Combine all characters
    const allCharacters = upperCase + lowerCase + numbers + specialCharacters;

    // Ensure the password contains at least one character from each category
    const passwordArray = [
        upperCase[Math.floor(Math.random() * upperCase.length)],
        lowerCase[Math.floor(Math.random() * lowerCase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
    ];

    // Generate the remaining characters randomly
    for (let i = passwordArray.length; i < length; i++) {
        passwordArray.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    // Shuffle the password array to ensure randomness
    const password = passwordArray.sort(() => Math.random() - 0.5).join('');
    return password;
}

class epoBoxController {

    static async checkEpoBoxAccount(req, res) {
        const { mobileNumber } = req.params;
        try {
            const result = await axios.get(process.env.EPOBOX_URL + `/virtual-address/${mobileNumber}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });;
            if (result.data.status == true) {
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Account Details",
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus: "FAILED",
                    responseDescription: result.data.message
                });
            }

        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json({
                    responseCode: 400,
                    responseDescription: error.message,
                    data: error.response.data,
                });
            } else {
                res.status(500).json({
                    responseCode: 500,
                    communicationStatus: "FAILED",
                    error: "Dear client, we're unable to complete your transaction right now. Please try again later."
                });
            }
        }
    }
    static async virtualAddressRegister(req, res) {
        const {
            firstName,
            lastName,
            email,
            addressType,
            // postalCodeI,
            address,
            // channel,
            nationalId,
            // virtualAddressName,
            // applicationNumber,
            // billI,
            // amount,
            toMemberId,
            transferTypeId,
            currencySymbol, 
            description

        } = req.body;
        const username = generateUsername(firstName, lastName);
        const password = generateStrongPassword(12);
   
        // const axios = require('axios');
        let data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mem="http://members.webservices.cyclos.strohalm.nl/">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <mem:registerMember>\r\n         <!--Optional:-->\r\n         <params>\r\n            <!--Optional:-->\r\n            <groupId>24</groupId>\r\n            <!--Optional:-->\r\n            <username>${username}</username>\r\n            <!--Optional:-->\r\n            <name>MPost User 2</name>\r\n            <!--Optional:-->\r\n            <email>${email}</email>\r\n            <!--Optional:-->\r\n            <loginPassword>${password}</loginPassword>\r\n            <fields>\r\n               <!--Optional:-->\r\n               <internalName>addressType</internalName>\r\n               <!--Optional:-->\r\n               <fieldId>123</fieldId>\r\n               <!--Optional:-->\r\n               <value>${addressType}</value>\r\n               <!--Optional:-->\r\n               <internalName>address</internalName>\r\n               <!--Optional:-->\r\n               <fieldId>124</fieldId>\r\n               <!--Optional:-->\r\n               <value>${address}</value>\r\n               <!--Optional:-->\r\n               <internalName>nationalId</internalName>\r\n               <!--Optional:-->\r\n               <fieldId>125</fieldId>\r\n               <!--Optional:-->\r\n               <value>${nationalId}</value>\r\n            </fields>\r\n         </params>\r\n      </mem:registerMember>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://test.ddin.rw/coretest/services/members',
            headers: {
                'Content-Type': 'application/xml'
            },
            data: data
        };

        await axios.request(config)
            .then((response) => {
                //   console.log(JSON.stringify(response.data));
                //   return res.status(200).json({
                //     responseCode: 200,
                //     communicationStatus: "SUCCESS",
                //     responseDescription: "Account Created Successfully",
                //     data:JSON.stringify(response.data)
                // });
                //call API for payment
            makeEpoBoxPayment(req,res,toMemberId, transferTypeId, currencySymbol, description)    
            })
            .catch((error) => {
                // Extract relevant information from the error
                const errorResponse = error.response || {};
                const errorMessage = errorResponse.data || error.message || "An error occurred";
                const errorStatus = errorResponse.status || 500;

                return res.status(errorStatus).json({
                    responseCode: errorStatus,
                    communicationStatus: "FAILED",
                    error: {
                        message: errorMessage,
                        details: errorResponse.data || null // Provide additional error details if available
                    }
                });
            });



    }


    static async getAllPostCode(req, res) {
        try {
            const result = await axios.get(process.env.EPOBOX_URL + `/postal-code`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });;
            if (result.data.status == true) {
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Postal Code",
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus: "FAILED",
                    responseDescription: result.data.message
                });
            }

        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json({
                    responseCode: 400,
                    responseDescription: error.message,
                    data: error.response.data,
                });
            } else {
                res.status(500).json({
                    responseCode: 500,
                    communicationStatus: "FAILED",
                    error: "Dear client, we're unable to complete your transaction right now. Please try again later."
                });
            }
        }
    }
}


module.exports = epoBoxController;