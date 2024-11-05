const dotenv = require("dotenv")
const axios = require("axios");


dotenv.config();
//new methode
const createNewEpoBoxAccount = async (req, res, description,transactionId) => {
    const {
        firstName,
        lastName,
        email,
        addressType,
        postalCodeId,
        address,
        channel,
        nationalId,
        virtualAddressName,
        applicationNumber,
        billI

    } = req.body;

    const axios = require('axios');
    let data = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "addressType": addressType,
        "postalCodeId": postalCodeId,
        "address": address,
        "channel": channel,
        "nationalId": nationalId,
        "virtualAddressName": virtualAddressName,
        "applicationNumber": applicationNumber,
        "billI": billI,
        "amount": "some-amount"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://8u390eg26g.execute-api.eu-west-1.amazonaws.com/v1/virtual-address/register',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    await axios.request(config)
        .then((response) => {
            // console.log(JSON.stringify(response.data));
            if (response.data.status == true) {
                return res.status(201).json({
                    responseCode: 201,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Account Created Successful",
                    data:{
                        transactionId:transactionId,
                        description:description,
                        details: response.data
                    }
                });
            } else {
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus: "FAILED",
                    responseDescription: response.data.message
                });
            }

        })
        .catch((error) => {
            console.log(error)
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
        });



}

module.exports = createNewEpoBoxAccount