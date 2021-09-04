const pool = require("../controller/database")
const mailgun = require("../lib/mailgun")
const { parentPort } = require("worker_threads")

let isCancelled = false;

// this function get's called by the bree library
// it runs on each begining of the month
// it runs for each dealer in the database
// it inserts a new record into the transaction_reports table, the record contains the sum of all earnings the dealer earned previous month.
(async () => {
    try {
        // get all dealers user ids
        const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
        // map user_ids to create an array of user_ids
        const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        // query statement
        const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND user_id = $1"
        // get current date
        const date = new Date()
        // change it to previous month, while always setting date equal to '01'
        const prevMonthDate = `${date.getFullYear()}-${date.getMonth()}-${'01'}`
        // for every dealer (user_id)
        for (let i = 0; i < dealers.length; i++) {
            // get the transactions the user made the previous month
            const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
            // declare a variable for readability
            const transactionSum = transactionsQuery.rows[0].sum
            // if the dealer had made transactions in the previous month... (it returns null if the dealer hasn't made any transactions)
            if (transactionSum !== null) {
                //insert a new record into the transaction_reports table, containing the sum of all previous month's transactions
                await pool.query("INSERT INTO transaction_reports VALUES ($1, $2, $3)", [dealers[i], transactionSum, prevMonthDate])
                console.log('printed report for user_id ', dealers[i])
            }
        }
        if (parentPort) parentPort.postMessage('done');
        else process.exit(0)
    } catch (err) {
        console.log(err)
        const emailData = {
            from: '<info@obexport.com>',
            to: 'mohammad.nadom98@gmail.com',
            subject: 'PRINT REPORT SERVER ERROR',
            text: "A server error occurred while printing monthly transaction report, the error's content is \n " + err
        }
        mailgun.messages().send(emailData, (err, body) => {
            console.log('successfuly sent an email to mohammad.nadom98@gmail.com, body: ', body)
            process.exit(0);
        });
    }
})();



















// (async () => {
//     try {
//         const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
//         const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        
//         const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
//         for (let i = 0; i < dealers.length; i++) {
//             const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
//             const transactionSum = transactionsQuery.rows[0].sum
//             if (transactionSum !== null) {
//                 await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
//                 console.log('REPORT PRINT SUCCESS!!!')
//             }
//         }        
//     } catch (err) {
//         console.log(err)
//     }    
// })()

// const printReport = async () => {
//     try {
//         const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
//         const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        
//         const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
//         for (let i = 0; i < dealers.length; i++) {
//             const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
//             const transactionSum = transactionsQuery.rows[0].sum
//             if (transactionSum !== null) {
//                 await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
//                 console.log('REPORT PRINT SUCCESS!!!')
//             }
//         }        
//     } catch (err) {
//         console.log(err)
//     }

// }

// printReport()

