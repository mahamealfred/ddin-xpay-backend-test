const dotenv = require("dotenv")
const axios = require("axios");
const onBoardClient = require("./onBoardClientService");
const Chargeback = require("../Utils/chargback");


dotenv.config();
//new methode
const createNewEpoBoxAccount = async (req, res, description, transactionId) => {
    const {
        firstName,
        lastName,
        email,
        addressType,
        postalCodeId,
        address,
        nationalId

    } = req.body;
    let data
    if (addressType === 1) {
        data = JSON.stringify({
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "addressType": addressType,
            "postalCodeId": postalCodeId,
            "address": address,
            "channel": "DDIN",
            "nationalId": nationalId,
            "virtualAddressName": address,
            "applicationNumber": "dummy-app-number",
            "billI": "dummy-bill-id",
            "amount": "some-amount"
        });
    }
    data = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "addressType": addressType,
        "postalCodeId": postalCodeId,
        "address": address,
        "channel": "Irembo",
        "nationalId": nationalId,
        "virtualAddressName": "+250780123456",
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
                onBoardClient(firstName,lastName, email, addressType, address, nationalId)
                return res.status(201).json({
                    responseCode: 201,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Account Created Successful",
                    data: {
                        transactionId: transactionId,
                        description: description,
                        details: response.data
                    }
                });
            } else {
                Chargeback(transactionId)
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus: "FAILED",
                    responseDescription: response.data.message
                });
            }

        })
        .catch((error) => {

            if (error.response) {
                Chargeback(transactionId)
                res.status(error.response.status).json({
                    responseCode: 400,
                    responseDescription: error.response.data.message[0].constraints,
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