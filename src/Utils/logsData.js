const dbConnect = require("../db/config");

const logsData = async(transactionId,thirdpart_status,description,amount,agent_name,status)=>{
    const data = {
        transactionId: transactionId,
        thirdpart_status: thirdpart_status,
        service_name: 'Pindo Bulks SMS',
        status: status,
        description: description,
        amount: amount,
        agent_name: agent_name
    };

    //Insert into logs table
     dbConnect.query('INSERT INTO logs SET ?', data, (error, results) => {
        if (error) {
            console.error('Error inserting into logs: ' + error.message);
            //res.status(500).send('Error inserting into logs');
            return;
        }
        console.log('Data inserted into logs: ', results);
        //res.send('Data inserted into logs');
    });
};

module.exports= logsData