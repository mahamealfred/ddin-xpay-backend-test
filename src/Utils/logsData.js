const dbConnect = require("../db/config");

const logsData = async(transactionId,thirdpart_status,description,amount,agent_name,status,service_name,trxId)=>{
    const data = {
        transactionId: transactionId,
        thirdpart_status: thirdpart_status,
        service_name: service_name,
        status: status,
        description: description,
        amount: amount,
        agent_name: agent_name,
        transaction_reference: trxId
    };

    //Insert into logs table
     dbConnect.query('INSERT INTO transactions_status SET ?', data, (error, results) => {
        if (error) {
            console.error('Error inserting into logs: ' + error.message);
            //res.status(500).send('Error inserting into logs');
            return;
        }
        console.log('Data inserted into logs: ', results);
        //res.send('Data inserted into logs');
    });
};
const updateLogs = async(transactionId,status,trxId)=>{
  
    //Insert into logs table
     dbConnect.query(
        'UPDATE transactions_status SET transactionId = ?, status = ? WHERE transaction_reference = ?',
        [transactionId, status, trxId],
        (error, results) => {  
          if (error) {
            console.error('Error executing update query:', error);
           // res.status(500).send('Error updating employee salary');
          } else {
            console.log('Update successful');
           // res.send('Employee salary updated successfully');
          }
        }
      );
};
const selectAllLogs=async()=>{
  
    dbConnect.query('SELECT * FROM transactions_status', (error, results) => {
      if (error) {
        console.error('Error executing select query:', error);
       // res.status(500).send('Error updating employee salary');
      } else {
       // console.log(' successful',results);
       let transactions=[]
       results.forEach(element => {
        if(element.status === "Complete")
        transactions.push({
            ID:element.ID
        });
    
    })
   // console.log('successful',transactions);
        return transactions
       // res.send('Employee salary updated successfully');
      }
     /// return transactions
    }
  );
};

// const insertInBulkServicePayment = async(service_name,agent_name,amount,successCount,failureCount,description,status)=>{
//   let total_amount=amount*successCount;
//   const data = {
//       service_name:service_name,
//       status: status,
//       description: description,
//       amount: total_amount,
//       successCount:successCount,
//       failureCount:failureCount,
//       agent_name: agent_name
//   };
//   //Insert into logs table
//    dbConnect.query('INSERT INTO BulkServicePaymentResults SET ?', data, (error, results) => {
//       if (error) {
//           console.error('Error inserting into logs: ' + error.message);
//           //res.status(500).send('Error inserting into logs');
//           return;
//       }
//       console.log('Data inserted into logs: ', results);
//       //res.send('Data inserted into logs');
//   });
// };


const insertInBulkServicePayment=async(service_name, agent_name, amount, successCount, failureCount, description, status)=> {
  //const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'your_database' });
  try {
    await dbConnect.query(
      'INSERT INTO BulkServicePaymentResults (service_name, agent_name, amount, successCount, failureCount, description, status) VALUES (?, ?, ?, ?, ?, CAST(? AS JSON), ?)',
      [service_name, agent_name, amount, successCount, failureCount, description, status]
    );
  } catch (error) {
    console.error('Error inserting into logs:', error);
    return;
  } 
};

module.exports= {logsData,updateLogs,selectAllLogs,insertInBulkServicePayment}