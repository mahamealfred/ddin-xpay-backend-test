const dotenv = require("dotenv")
const axios = require("axios");
const dbConnect = require("../db/config");
dotenv.config();
class logsController {
    static async getLogs(req, res) {
        const authheader = req.headers.authorization;
        try {
            const response = await axios.get(process.env.CORE_TEST_URL + '/coretest/rest/accounts/default/history', {
                headers: {
                    Authorization: authheader,
                },
                withCredentials: true,
            });
            if (response.status === 200) {
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Account Transactions",
                    data: response.data
                });
            }
            return res.status(500).json({
                responseCode: 500,
                communicationStatus: "FAILED",
                responseDescription: "Something went wrong, Please try again later.",
            });

        } catch (error) {
            if (error.response.status === 401) {
                return res.status(401).json({
                    responseCode: 401,
                    communicationStatus: "FAILED",
                    responseDescription: "Username and Password are required for authentication"
                });
            }
            if (error.response.status === 400) {
                return res.status(400).json({
                    responseCode: 400,
                    communicationStatus: "FAILED",
                    responseDescription: "Invalid Username or Password"
                });
            }
            if (error.response.status === 404) {
                return res.status(404).json({
                    responseCode: 404,
                    communicationStatus: "FAILED",
                    responseDescription: "Account Not Found"
                });
            }
            return res.status(500).json({
                responseCode: 500,
                communicationStatus: "FAILED",
                error: error.message,
            });
        }

    }

    static async getLogsFromMysql(req, res) {
        //  const authheader = req.headers.authorization;
        try {
            dbConnect.query('SELECT * FROM logs', (error, results) => {
                if (error) {
                    return res.status(500).json({
                        responseCode: 500,
                        communicationStatus: "FAILED",
                        responseDescription: "Error while fecthing data from Database.",
                    });
                }
                return res.status(200).json({
                    responseCode: 200,
                    communicationStatus: "SUCCESS",
                    responseDescription: "Transactions Logs",
                    data: results
                });
            });

        } catch (error) {
            return res.status(500).json({
                responseCode: 500,
                communicationStatus: "FAILED",
                error: error.message,
            });
        }

    }

}
module.exports = logsController;